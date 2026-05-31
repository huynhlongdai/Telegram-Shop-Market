import { useState } from "react";
import {
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Store,
  ShoppingCart,
  Lock,
  ChevronRight,
  Settings,
  Ban,
  Activity,
  Zap,
  CreditCard,
  UserPlus,
  RefreshCw,
  Circle,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

async function apiFetch(path: string, token: string, opts: RequestInit = {}) {
  const res = await fetch(`/api${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers ?? {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function AdminPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"overview" | "shops" | "disputes">("overview");

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => apiFetch("/admin/stats", token!),
    enabled: !!token,
    retry: false,
  });

  const { data: pendingShops, isLoading: shopsLoading } = useQuery({
    queryKey: ["admin", "shops", "pending"],
    queryFn: () => apiFetch("/admin/shops?status=pending", token!),
    enabled: !!token && activeTab === "shops",
    retry: false,
  });

  const { data: disputes, isLoading: disputesLoading } = useQuery({
    queryKey: ["admin", "disputes"],
    queryFn: () => apiFetch("/admin/disputes?status=open", token!),
    enabled: !!token && activeTab === "disputes",
    retry: false,
  });

  const { mutate: approveShop } = useMutation({
    mutationFn: ({ shopId, status }: { shopId: number; status: string }) =>
      apiFetch(`/admin/shops/${shopId}`, token!, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => {
      toast({ title: "Shop status updated" });
      queryClient.invalidateQueries({ queryKey: ["admin", "shops"] });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const { mutate: resolveDispute } = useMutation({
    mutationFn: ({ disputeId, status, resolution }: { disputeId: number; status: string; resolution: string }) =>
      apiFetch(`/admin/disputes/${disputeId}`, token!, { method: "PATCH", body: JSON.stringify({ status, resolution }) }),
    onSuccess: () => {
      toast({ title: "Dispute resolved" });
      queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-zinc-100 tracking-tight">TeleShop Admin</h1>
            <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Admin
            </span>
          </div>
          <button
            onClick={() => refetchStats()}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-zinc-500 font-medium">{new Date().toDateString()}</div>

        <div className="flex gap-1 mt-3">
          {(["overview", "shops", "disputes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                activeTab === tab ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab}
              {tab === "shops" && pendingShops?.total > 0 && (
                <span className="ml-1.5 bg-amber-500 text-black text-[9px] font-bold px-1 py-0.5 rounded-full">
                  {pendingShops.total}
                </span>
              )}
              {tab === "disputes" && disputes?.total > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
                  {disputes.total}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-5">
        {activeTab === "overview" && (
          <>
            {statsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-emerald-400 mb-2">
                      <Store className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Shops Active</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-400">{stats?.activeShops ?? 0}</div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-blue-400 mb-2">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Total Orders</span>
                    </div>
                    <div className="text-xl font-bold text-blue-400">{stats?.totalOrders ?? 0}</div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-red-400 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Open Disputes</span>
                    </div>
                    <div className="text-xl font-bold text-red-400">{stats?.openDisputes ?? 0}</div>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Total Revenue</span>
                    </div>
                    <div className="text-lg font-bold text-amber-400">
                      {Number(stats?.totalRevenue ?? 0).toFixed(0)} <span className="text-xs opacity-70">USDT</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5 mb-4">
                    <BarChart3 className="w-4 h-4 text-zinc-400" /> Platform Revenue
                  </h2>
                  <div className="flex items-end gap-1 h-12 mb-3">
                    {[40, 55, 30, 70, 65, 85, 100].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm ${i === 6 ? "bg-emerald-400" : "bg-zinc-700"}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">+18%</span> vs last month
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab("shops")}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 p-3 rounded-lg flex flex-col items-center gap-2"
                  >
                    <Store className="w-5 h-5 text-zinc-300" />
                    <span className="text-xs font-medium text-zinc-300">Manage Shops</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("disputes")}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 p-3 rounded-lg flex flex-col items-center gap-2"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-xs font-medium text-red-400">Review Disputes</span>
                  </button>
                  <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 p-3 rounded-lg flex flex-col items-center gap-2">
                    <Settings className="w-5 h-5 text-zinc-300" />
                    <span className="text-xs font-medium text-zinc-300">Config Fees</span>
                  </button>
                  <button className="bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 p-3 rounded-lg flex flex-col items-center gap-2">
                    <Ban className="w-5 h-5 text-red-500" />
                    <span className="text-xs font-medium text-red-500">Ban User</span>
                  </button>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800/50">
                    <span className="text-xs font-medium text-zinc-400">System Status</span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Live
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["API", "TON Node", "Escrow"].map((label) => (
                      <div key={label} className="flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 font-medium uppercase">{label}</span>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                          <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" /> Online
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "shops" && (
          <>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Pending Shop Approvals
            </h2>
            {shopsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
              </div>
            ) : pendingShops?.items?.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No pending shops</div>
            ) : (
              <div className="space-y-3">
                {pendingShops?.items?.map((shop: any) => (
                  <div
                    key={shop.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-medium text-zinc-100">{shop.name}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">@{shop.slug} • {shop.plan} plan</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{new Date(shop.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                        {shop.status}
                      </span>
                    </div>
                    {shop.description && (
                      <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{shop.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => approveShop({ shopId: shop.id, status: "active" })}
                        className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold py-2 rounded-lg transition-colors border border-emerald-500/20"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => approveShop({ shopId: shop.id, status: "suspended" })}
                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold py-2 rounded-lg transition-colors border border-red-500/20"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "disputes" && (
          <>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-red-400" /> Open Disputes
            </h2>
            {disputesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
              </div>
            ) : disputes?.items?.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No open disputes</div>
            ) : (
              <div className="space-y-3">
                {disputes?.items?.map((dispute: any) => (
                  <div key={dispute.id} className="bg-zinc-900 border-l-4 border-l-red-500 border border-zinc-800 rounded-r-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-zinc-100">Dispute #{dispute.id}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">Order #{dispute.orderId}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{new Date(dispute.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                        {dispute.status}
                      </span>
                    </div>
                    {dispute.buyerNote && (
                      <p className="text-xs text-zinc-400 mb-3 line-clamp-2 italic">"{dispute.buyerNote}"</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => resolveDispute({ disputeId: dispute.id, status: "resolved", resolution: "Refund to buyer" })}
                        className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold py-2 rounded-lg border border-blue-500/20"
                      >
                        Refund Buyer
                      </button>
                      <button
                        onClick={() => resolveDispute({ disputeId: dispute.id, status: "resolved", resolution: "Release to seller" })}
                        className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold py-2 rounded-lg border border-emerald-500/20"
                      >
                        Release to Seller
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
