import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Bell, Sparkles, X, Zap, Loader2 } from "lucide-react";
import { useGetMyShop, useListProducts } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export default function FlashSalePage() {
  const { token } = useAuth();
  const [notifyFollowers, setNotifyFollowers] = useState(true);
  const [featureMarketplace, setFeatureMarketplace] = useState(false);
  const [saleName, setSaleName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Record<number, { salePrice: string; limit: number }>>({});
  const [saving, setSaving] = useState(false);

  const { data: myShop } = useGetMyShop();
  const { data: productsData, isLoading } = useListProducts(
    myShop?.id ? { shopId: myShop.id } : undefined,
  );
  const products = productsData?.items ?? [];

  const activeProducts = products.filter((p: any) => p.status === "active");

  const toggleProduct = (id: number, price: string) => {
    setSelectedProducts((prev) => {
      if (prev[id]) {
        const n = { ...prev };
        delete n[id];
        return n;
      }
      return { ...prev, [id]: { salePrice: price, limit: 0 } };
    });
  };

  const handleLaunch = async () => {
    if (!saleName || !startTime || !endTime) {
      toast({ title: "Fill in all fields", variant: "destructive" });
      return;
    }
    if (Object.keys(selectedProducts).length === 0) {
      toast({ title: "Select at least one product", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      for (const [productId, { salePrice }] of Object.entries(selectedProducts)) {
        await fetch(`/api/products/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ flashSalePrice: salePrice, flashSaleEnd: new Date(endTime).toISOString() }),
        });
      }
      toast({ title: "Flash sale launched!", description: `${saleName} is now active.` });
    } catch (e) {
      toast({ title: "Failed to launch", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0f0f13] text-slate-50 pb-40">
      <header className="sticky top-0 z-10 bg-[#0f0f13]/80 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard">
          <button className="text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold tracking-tight flex-1">Create Flash Sale</h1>
      </header>

      <main className="p-4 space-y-5">
        <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block uppercase tracking-wider">Sale Name</label>
            <input
              type="text"
              value={saleName}
              onChange={(e) => setSaleName(e.target.value)}
              placeholder="e.g. Summer Clear-Out Sale"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block uppercase tracking-wider">Start</label>
              <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block uppercase tracking-wider">End</label>
              <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none w-full"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Notify followers</p>
                <p className="text-xs text-slate-400">Send push to followers</p>
              </div>
            </div>
            <button
              onClick={() => setNotifyFollowers(!notifyFollowers)}
              className={`w-11 h-6 rounded-full relative transition-colors ${notifyFollowers ? "bg-blue-500" : "bg-slate-800"}`}
            >
              <div
                className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all"
                style={{ transform: notifyFollowers ? "translateX(22px)" : "translateX(2px)" }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Feature on Marketplace</p>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-medium border border-purple-500/30">5 USDT/day</span>
                </div>
                <p className="text-xs text-slate-400">Boost visibility during sale</p>
              </div>
            </div>
            <button
              onClick={() => setFeatureMarketplace(!featureMarketplace)}
              className={`w-11 h-6 rounded-full relative transition-colors ${featureMarketplace ? "bg-blue-500" : "bg-slate-800"}`}
            >
              <div
                className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all"
                style={{ transform: featureMarketplace ? "translateX(22px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">
              {Object.keys(selectedProducts).length} product{Object.keys(selectedProducts).length !== 1 ? "s" : ""} selected
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : activeProducts.length === 0 ? (
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 text-center text-slate-400 text-sm">
              No active products found.{" "}
              <Link href="/dashboard/products">
                <span className="text-blue-400 underline">Add products</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeProducts.map((product: any) => {
                const selected = selectedProducts[product.id];
                return (
                  <div
                    key={product.id}
                    className={`bg-slate-900/50 border rounded-xl p-3 transition-colors ${selected ? "border-blue-500/30 bg-blue-950/20" : "border-white/5"}`}
                  >
                    <div className="flex gap-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-800 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{product.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{product.price} {product.currency}</p>
                        {selected && (
                          <div className="mt-2 flex items-center gap-2">
                            <label className="text-[11px] text-slate-400">Sale price:</label>
                            <input
                              type="text"
                              value={selected.salePrice}
                              onChange={(e) =>
                                setSelectedProducts((prev) => ({
                                  ...prev,
                                  [product.id]: { ...prev[product.id], salePrice: e.target.value },
                                }))
                              }
                              className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none w-24"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleProduct(product.id, product.price)}
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                          selected
                            ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                        }`}
                      >
                        {selected ? <X className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-[#0f0f13] border-t border-white/10 p-4 pb-8 space-y-3">
        {featureMarketplace && (
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Marketplace feature</span>
            <span>5 USDT (1 day)</span>
          </div>
        )}
        <button
          onClick={handleLaunch}
          disabled={saving}
          className="w-full bg-[#0098EA] hover:bg-[#0088D1] disabled:opacity-50 text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(0,152,234,0.3)] transition-all flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {featureMarketplace ? "Pay 5 USDT & Launch Sale" : "Launch Flash Sale"}
        </button>
        <Link href="/dashboard">
          <button className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-slate-300 font-medium py-3 px-4 rounded-xl transition-all text-sm">
            Cancel
          </button>
        </Link>
      </footer>
    </div>
  );
}
