import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Plus,
  Copy,
  RefreshCw,
  Loader2,
  Percent,
  CalendarIcon,
} from "lucide-react";
import { useListVouchers, useCreateVoucher } from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function VoucherPage() {
  const { data, isLoading, refetch } = useListVouchers({});
  const { mutate: createVoucher, isPending } = useCreateVoucher();

  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState(generateCode());
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const vouchers = data?.items ?? [];

  const handleCreate = () => {
    if (!code || !discountValue) {
      toast({ title: "Fill in code and discount value", variant: "destructive" });
      return;
    }
    createVoucher(
      {
        code,
        discountType,
        discountValue,
        minOrderAmount: minOrder || undefined,
        maxUses: maxUses ? Number(maxUses) : undefined,
        expiresAt: expiresAt || undefined,
      } as any,
      {
        onSuccess: () => {
          toast({ title: "Voucher created!" });
          setShowForm(false);
          setCode(generateCode());
          setDiscountValue("");
          setMinOrder("");
          setMaxUses("");
          setExpiresAt("");
          refetch();
        },
        onError: (e: Error) => {
          toast({ title: "Error", description: e.message, variant: "destructive" });
        },
      },
    );
  };

  const copyCode = (c: string) => {
    navigator.clipboard.writeText(c);
    toast({ title: `Copied: ${c}` });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="flex items-center justify-between p-4 border-b border-slate-800 sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 flex items-center justify-center">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">Vouchers & Coupons</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0088CC] hover:bg-[#0077B3] text-white rounded-full h-8 px-3 text-xs font-medium flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Create
        </button>
      </header>

      <div className="p-4 space-y-6 pb-24">
        {vouchers.length > 0 && (
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-slate-200">{vouchers.filter((v: any) => v.isActive).length}</span>
              <span>Active</span>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-slate-200">{vouchers.reduce((s: number, v: any) => s + v.usedCount, 0)}</span>
              <span>Total uses</span>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[#0088CC]">{vouchers.length}</span>
              <span>Vouchers</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : vouchers.length === 0 && !showForm ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto">
              <Percent className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 text-sm">No vouchers yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#0088CC] text-white rounded-xl px-6 py-3 text-sm font-medium"
            >
              Create your first voucher
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              {vouchers.filter((v: any) => v.isActive).length > 0 ? "Active Vouchers" : "Vouchers"}
            </h2>
            {vouchers.map((voucher: any) => {
              const isExpired = voucher.expiresAt && new Date(voucher.expiresAt) < new Date();
              const isFull = voucher.maxUses && voucher.usedCount >= voucher.maxUses;
              const isActive = voucher.isActive && !isExpired && !isFull;
              const pct = voucher.maxUses ? Math.round((voucher.usedCount / voucher.maxUses) * 100) : 0;

              return (
                <div
                  key={voucher.id}
                  className={`relative bg-slate-900 border rounded-xl overflow-hidden flex ${
                    isActive ? "border-slate-800" : "border-slate-800/50 opacity-60 grayscale-[0.5]"
                  }`}
                >
                  <div className={`w-1 ${isActive ? "bg-[#0088CC]" : "bg-slate-600"}`} />
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono text-sm font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
                          {voucher.code}
                          <button onClick={() => copyCode(voucher.code)}>
                            <Copy className="h-3 w-3 text-slate-500 hover:text-slate-300" />
                          </button>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase border ${
                          isExpired || isFull
                            ? "bg-slate-800/50 text-slate-400 border-slate-700"
                            : voucher.discountType === "percent"
                            ? "bg-slate-800/50 text-[#0088CC] border-[#0088CC]/30"
                            : "bg-slate-800/50 text-emerald-400 border-emerald-400/30"
                        }`}>
                          {isExpired ? "EXPIRED" : isFull ? "FULL" : voucher.discountType === "percent" ? "% Off" : "Fixed"}
                        </span>
                      </div>
                    </div>

                    <div className={`text-2xl font-bold mb-2 ${isActive ? "text-white" : "text-slate-400"}`}>
                      {voucher.discountType === "percent"
                        ? `-${voucher.discountValue}%`
                        : `-${voucher.discountValue} USDT`}
                    </div>

                    <div className="text-xs text-slate-400 space-y-1 mb-3">
                      {voucher.minOrderAmount && <div>Min order: {voucher.minOrderAmount} USDT</div>}
                      {voucher.expiresAt ? (
                        <div className={isExpired ? "text-red-400" : "text-amber-500 font-medium"}>
                          {isExpired ? "Expired" : "Expires"} {new Date(voucher.expiresAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <div>No expiry date</div>
                      )}
                    </div>

                    {voucher.maxUses && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>{voucher.usedCount} used</span>
                          <span>{voucher.maxUses} limit</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isActive ? "bg-[#0088CC]" : "bg-slate-600"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <div className="space-y-5 border-t border-slate-800 pt-6">
            <h2 className="text-lg font-semibold text-slate-100">Create New Voucher</h2>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Voucher Code</label>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 font-mono font-bold tracking-widest text-lg uppercase focus:outline-none focus:border-[#0088CC]/50"
                />
                <button
                  onClick={() => setCode(generateCode())}
                  className="bg-slate-900 border border-slate-800 text-slate-300 px-3 rounded-xl flex items-center"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Discount Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["percent", "fixed"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDiscountType(t)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-colors ${
                      discountType === t
                        ? "bg-[#0088CC] text-white border-[#0088CC]"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {t === "percent" ? "% Off" : "Fixed USDT"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Value</label>
                <div className="relative">
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="30"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 pr-8 text-slate-100 font-semibold focus:outline-none focus:border-[#0088CC]/50"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-500 text-sm">
                    {discountType === "percent" ? "%" : "USDT"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Min Order</label>
                <div className="relative">
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 pr-12 text-slate-100 font-semibold focus:outline-none focus:border-[#0088CC]/50"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">USDT</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Max Uses</label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Unlimited"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-[#0088CC]/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Expires</label>
                <div className="relative flex items-center">
                  <CalendarIcon className="absolute left-3 h-4 w-4 text-slate-500" />
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 pl-9 text-slate-100 text-xs focus:outline-none focus:border-[#0088CC]/50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="w-full bg-[#0088CC] hover:bg-[#0077B3] disabled:opacity-50 text-white rounded-xl h-12 font-semibold text-base shadow-lg shadow-[#0088CC]/20 flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create & Activate
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="w-full bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-900 rounded-xl h-12 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
