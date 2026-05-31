import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  Info,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export default function WalletPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCurrency, setSelectedCurrency] = useState<"TON" | "USDT">("TON");
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: () => apiFetch("/wallet/balance", token!),
    enabled: !!token,
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["wallet", "transactions"],
    queryFn: () => apiFetch("/wallet/transactions?limit=10", token!),
    enabled: !!token,
  });

  const { mutate: withdraw, isPending: withdrawPending } = useMutation({
    mutationFn: () =>
      apiFetch("/wallet/withdraw", token!, {
        method: "POST",
        body: JSON.stringify({ amount, currency: selectedCurrency, toAddress }),
      }),
    onSuccess: () => {
      toast({ title: "Withdrawal submitted", description: "Your request is being processed." });
      setAmount("");
      setToAddress("");
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: (e: Error) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const txs = txData?.items ?? [];

  return (
    <div className="min-h-[100dvh] bg-[#0f0f11] text-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-[#0f0f11]/90 backdrop-blur-md z-10 border-b border-white/5">
        <Link href="/profile">
          <button className="p-2 -ml-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10">
            <ArrowLeft size={24} />
          </button>
        </Link>
        <h1 className="text-lg font-semibold tracking-wide text-gray-100">My Wallet</h1>
        <button className="p-2 -mr-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10">
          <ShieldCheck size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Available Balance</p>
              <div className="flex items-baseline space-x-1 mb-1">
                {balanceLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0098EA]" />
                ) : (
                  <>
                    <span className="text-xl font-bold text-[#0098EA]">{Number(balance?.balanceTon ?? 0).toFixed(2)}</span>
                    <span className="text-sm font-semibold text-[#0098EA]">TON</span>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedCurrency("TON")}
                className="w-full py-2 bg-[#0098EA]/10 hover:bg-[#0098EA]/20 text-[#0098EA] rounded-xl text-sm font-semibold transition-colors border border-[#0098EA]/20"
              >
                Withdraw TON
              </button>
            </div>

            <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Available Balance</p>
              <div className="flex items-baseline space-x-1 mb-1">
                {balanceLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#26A17B]" />
                ) : (
                  <>
                    <span className="text-xl font-bold text-[#26A17B]">{Number(balance?.balanceUsdt ?? 0).toFixed(2)}</span>
                    <span className="text-sm font-semibold text-[#26A17B]">USDT</span>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedCurrency("USDT")}
                className="w-full py-2 bg-[#26A17B]/10 hover:bg-[#26A17B]/20 text-[#26A17B] rounded-xl text-sm font-semibold transition-colors border border-[#26A17B]/20"
              >
                Withdraw USDT
              </button>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto py-1">
            {balance?.escrowLocked && Number(balance.escrowLocked) > 0 && (
              <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 whitespace-nowrap">
                <Lock size={14} className="text-amber-500" />
                <span className="text-xs font-medium text-amber-500">Escrow locked: {Number(balance.escrowLocked).toFixed(2)} USDT</span>
              </div>
            )}
            {balance?.pendingCommission && Number(balance.pendingCommission) > 0 && (
              <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2 whitespace-nowrap">
                <Clock size={14} className="text-purple-400" />
                <span className="text-xs font-medium text-purple-400">Pending commission: {Number(balance.pendingCommission).toFixed(2)} USDT</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-white/5">
            <h2 className="text-base font-semibold text-white mb-4">Withdraw Funds</h2>

            <div className="flex bg-[#2c2c2e] p-1 rounded-xl mb-5">
              {(["TON", "USDT"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedCurrency === curr ? "bg-[#3c3c3e] text-white shadow-sm" : "text-gray-400"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Send to wallet</label>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="Wallet address"
                className="w-full bg-[#0f0f11] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0098EA]/50 font-mono"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount ({selectedCurrency})</label>
              <div className="flex items-center bg-[#0f0f11] border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#0098EA]/50">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-lg font-semibold text-white focus:outline-none"
                />
                <span className="text-sm text-gray-500 mr-2">{selectedCurrency}</span>
                <button
                  onClick={() => setAmount(balance?.balanceUsdt ?? "0")}
                  className="bg-white/10 hover:bg-white/20 text-xs font-semibold px-2 py-1 rounded text-white"
                >
                  Max
                </button>
              </div>
            </div>

            {amount && Number(amount) > 0 && (
              <div className="bg-[#0f0f11] rounded-xl p-3 mb-5 border border-white/5">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Amount</span>
                    <span className="text-gray-200">{amount} {selectedCurrency}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Platform fee (0.5%)</span>
                    <span className="text-gray-200">{(Number(amount) * 0.005).toFixed(4)} {selectedCurrency}</span>
                  </div>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex justify-between text-gray-300 font-medium">
                    <span>You receive</span>
                    <span className="text-white font-bold">{(Number(amount) * 0.995).toFixed(4)} {selectedCurrency}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => withdraw()}
              disabled={withdrawPending || !amount || !toAddress}
              className="w-full bg-[#0098EA] hover:bg-[#0088CC] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_15px_rgba(0,152,234,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {withdrawPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm Withdraw
            </button>

            <div className="mt-4 flex items-start space-x-2 text-red-400/80 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
              <Info size={14} className="mt-0.5 shrink-0" />
              <p className="text-[11px] font-medium leading-tight">Funds sent directly on-chain. Irreversible. Verify address before confirming.</p>
            </div>
          </div>
        </div>

        <div className="px-4 mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Transactions</h3>
          {txLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : txs.length === 0 ? (
            <div className="bg-[#1c1c1e] rounded-2xl p-6 text-center text-gray-500 text-sm border border-white/5">
              No transactions yet
            </div>
          ) : (
            <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5">
              <div className="divide-y divide-white/5">
                {txs.map((tx: any) => {
                  const isIncoming = Number(tx.amount) > 0;
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-3.5">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncoming ? "bg-[#26A17B]/10" : "bg-red-500/10"}`}>
                          {isIncoming ? (
                            <ArrowDownLeft size={16} className="text-[#26A17B]" />
                          ) : (
                            <ArrowUpRight size={16} className="text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">{tx.description ?? tx.type}</p>
                          <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold ${isIncoming ? "text-[#26A17B]" : "text-red-400"}`}>
                        {isIncoming ? "+" : ""}{Number(tx.amount).toFixed(2)} {tx.currency}
                      </p>
                    </div>
                  );
                })}
              </div>
              {txData?.total > 10 && (
                <button className="w-full p-3 text-xs font-medium text-gray-400 hover:text-white bg-white/5 flex items-center justify-center space-x-1">
                  <span>View all transactions</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="px-4 mb-8">
          <h3 className="text-sm font-semibold text-white mb-3">Wallet Security</h3>
          <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5 divide-y divide-white/5">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-200">2FA via Telegram</p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 size={12} className="text-[#26A17B]" />
                  <span className="text-xs text-[#26A17B]">Enabled</span>
                </div>
              </div>
              <button className="text-xs font-semibold text-[#0098EA] bg-[#0098EA]/10 px-3 py-1.5 rounded-lg">Manage</button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-200">Daily limit</p>
                <p className="text-xs text-gray-500 mt-0.5">500 USDT</p>
              </div>
              <button className="text-xs font-semibold text-white bg-white/10 px-3 py-1.5 rounded-lg">Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
