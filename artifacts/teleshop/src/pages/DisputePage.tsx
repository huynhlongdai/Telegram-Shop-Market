import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  Lock,
  MessageSquare,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetOrder } from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

async function apiFetch(path: string, token: string, opts: RequestInit = {}) {
  const res = await fetch(`/api${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const statusSteps = [
  { label: "Dispute Opened", key: "open" },
  { label: "Seller Notified", key: "notified" },
  { label: "Evidence Review", key: "reviewing" },
  { label: "Admin Decision", key: "admin_review" },
  { label: "Resolved", key: "resolved" },
];

export default function DisputePage() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: order, isLoading: orderLoading } = useGetOrder(Number(orderId) || 0);

  const { data: dispute, isLoading: disputeLoading } = useQuery({
    queryKey: ["dispute", orderId],
    queryFn: () => apiFetch(`/orders/${orderId}/dispute`, token!),
    enabled: !!token && !!orderId,
    retry: false,
  });

  const { mutate: openDispute, isPending } = useMutation({
    mutationFn: () =>
      apiFetch(`/orders/${orderId}/dispute`, token!, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => {
      toast({ title: "Dispute opened", description: "Admin will review within 24h." });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["dispute", orderId] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (e: Error) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const isLoading = orderLoading || disputeLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111113] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#111113] text-slate-200 flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  const currentStep = dispute
    ? statusSteps.findIndex((s) => s.key === dispute.status) >= 0
      ? statusSteps.findIndex((s) => s.key === dispute.status)
      : 0
    : -1;

  return (
    <div className="flex flex-col min-h-screen bg-[#111113] text-slate-200 font-sans">
      <header className="sticky top-0 z-10 bg-[#111113]/80 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/orders/${orderId}`}>
            <button className="p-1 -ml-1 text-slate-400 hover:text-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-lg font-medium text-slate-100">
            {dispute ? `Dispute #${dispute.id}` : "Open Dispute"}
          </h1>
        </div>
        {dispute && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
            dispute.status === "resolved"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}>
            {dispute.status === "resolved" ? "Resolved" : "Under Review"}
          </span>
        )}
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-6">
          <div className="bg-[#1C1C1F] border border-amber-500/10 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-amber-500/10">
                <Lock className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium text-amber-500/90 text-sm">
                  {order.totalAmount} {order.currency} in escrow
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {dispute
                    ? "Funds will be released based on admin decision."
                    : "Escrow will be held until dispute is resolved."}
                </p>
              </div>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Order Details</h2>
            <div className="bg-[#161618] border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-slate-200">Order #{order.id}</div>
                  <div className="text-sm text-slate-400 mt-0.5">Qty: {order.quantity}</div>
                </div>
                <div className="text-sm font-medium">{order.totalAmount} {order.currency}</div>
              </div>
              <div className="h-px bg-white/5" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Status</span>
                  <p className="text-slate-300 mt-0.5 capitalize">{order.status}</p>
                </div>
                <div>
                  <span className="text-slate-500">Date</span>
                  <p className="text-slate-300 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </section>

          {dispute ? (
            <>
              <section className="space-y-4">
                <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Dispute Timeline</h2>
                <div className="pl-2">
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/20 before:via-amber-500/20 before:to-white/5">
                    {statusSteps.map((step, i) => {
                      const isDone = i < currentStep;
                      const isCurrent = i === currentStep;
                      const isPending = i > currentStep;
                      return (
                        <div key={step.key} className="relative">
                          <div className="absolute left-[-28px] bg-[#111113] p-0.5 rounded-full">
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : isCurrent ? (
                              <div className="relative flex h-5 w-5 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20" />
                                <Clock className="w-4 h-4 text-amber-500" />
                              </div>
                            ) : (
                              <div className="p-1">
                                <Circle className="w-3 h-3 text-slate-600" />
                              </div>
                            )}
                          </div>
                          <span className={`text-sm font-medium ${isDone ? "text-slate-200" : isCurrent ? "text-amber-500/90" : "text-slate-500"}`}>
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span className="text-xs text-amber-500/60 block mt-0.5">In progress</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {dispute.buyerNote && (
                <section className="space-y-2">
                  <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Buyer's Statement</h2>
                  <div className="bg-[#161618] border border-white/5 rounded-2xl p-4">
                    <p className="text-xs text-slate-300">{dispute.buyerNote}</p>
                  </div>
                </section>
              )}

              {dispute.sellerNote && (
                <section className="space-y-2">
                  <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Seller's Response</h2>
                  <div className="bg-[#161618] border border-white/5 rounded-2xl p-4">
                    <p className="text-xs text-slate-300">{dispute.sellerNote}</p>
                  </div>
                </section>
              )}

              {dispute.resolution && (
                <section className="space-y-2">
                  <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Admin Resolution</h2>
                  <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4">
                    <p className="text-xs text-emerald-300">{dispute.resolution}</p>
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="space-y-4">
              <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Open a Dispute</h2>
              {!showForm ? (
                <div className="bg-[#161618] border border-white/5 rounded-2xl p-5 text-center space-y-4">
                  <p className="text-sm text-slate-400">
                    If there's an issue with your order, open a dispute to pause escrow release and get admin review.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-xl text-sm transition-colors"
                  >
                    Open Dispute
                  </button>
                </div>
              ) : (
                <div className="bg-[#161618] border border-white/5 rounded-2xl p-4 space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-2">Describe the issue</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explain what happened (min 10 characters)..."
                      rows={4}
                      className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>
                  <button
                    onClick={() => openDispute()}
                    disabled={isPending || reason.length < 10}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit Dispute
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="w-full text-slate-400 py-2 text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {dispute && dispute.status !== "resolved" && (
        <footer className="fixed bottom-0 inset-x-0 max-w-[390px] mx-auto p-4 bg-[#111113] border-t border-white/5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button className="w-full bg-transparent border border-white/10 text-slate-300 hover:bg-white/5 h-11 text-xs rounded-xl flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Evidence
            </button>
            <button className="w-full bg-transparent border border-white/10 text-slate-300 hover:bg-white/5 h-11 text-xs rounded-xl flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Support
            </button>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-tight">
              All communications are recorded. False claims may result in account suspension.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
