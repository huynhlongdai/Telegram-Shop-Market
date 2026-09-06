import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Zap, Loader2, Package, Check } from "lucide-react";
import { useGetMyShop, useListProducts } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export default function FlashSalePage() {
  const { token } = useAuth();
  const [name, setName] = useState(""); const [start, setStart] = useState(""); const [end, setEnd] = useState("");
  const [selected, setSelected] = useState<Record<number, string>>({}); const [saving, setSaving] = useState(false);
  const { data: shop } = useGetMyShop();
  const { data, isLoading } = useListProducts(shop?.id ? { shopId: shop.id } : undefined);
  const products = (data?.items ?? []).filter((product: any) => !product.status || product.status === "active");
  const toggle = (id: number, price: string) => setSelected((current) => { const next = { ...current }; if (next[id]) delete next[id]; else next[id] = String(Math.max(0.01, Number(price) * 0.9).toFixed(2)); return next; });
  const launch = async () => {
    if (!name || !start || !end || !Object.keys(selected).length) return toast({ title: "Complete the schedule and select products", variant: "destructive" });
    if (new Date(end) <= new Date(start)) return toast({ title: "End time must be after start time", variant: "destructive" });
    setSaving(true);
    try {
      const response = await fetch("/api/flash-sales", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, startTime: new Date(start).toISOString(), endTime: new Date(end).toISOString(), products: Object.entries(selected).map(([productId, salePrice]) => ({ productId: Number(productId), salePrice })) }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not create campaign");
      toast({ title: "Flash sale scheduled", description: `${body.productCount} products saved to ${body.name}.` });
      setName(""); setStart(""); setEnd(""); setSelected({});
    } catch (error) { toast({ title: "Could not configure sale", description: error instanceof Error ? error.message : undefined, variant: "destructive" }); }
    finally { setSaving(false); }
  };
  return <div className="pb-28"><div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3"><Link href="/dashboard" className="grid h-11 w-11 place-items-center rounded-lg border border-white/[0.09] bg-card"><ArrowLeft className="h-4 w-4" /></Link><div><p className="eyebrow mb-1">Campaign builder</p><p className="text-sm font-medium">Flash sale</p></div></div><div className="space-y-6 px-4 py-5"><section className="app-surface space-y-4 p-4"><div><p className="eyebrow mb-1.5">Schedule</p><h1 className="text-lg font-semibold">Configure campaign</h1></div><Field label="Campaign name"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Weekend drop" className="h-11 w-full rounded-lg border border-white/[0.09] bg-[#0d1015] px-3 text-sm outline-none focus:border-primary" /></Field><div className="grid grid-cols-2 gap-3"><Field label="Starts"><DateInput value={start} onChange={setStart} /></Field><Field label="Ends"><DateInput value={end} onChange={setEnd} /></Field></div><p className="text-[10px] leading-4 text-muted-foreground">Campaign name, start, end, selected products, and individual sale prices are stored by the server.</p></section><section><div className="mb-3 flex items-end justify-between"><div><p className="eyebrow mb-1.5">Catalog</p><h2 className="text-lg font-semibold">Select offers</h2></div><span className="font-mono text-[10px] text-primary">{Object.keys(selected).length} SELECTED</span></div>{isLoading ? <Loader2 className="mx-auto mt-12 h-5 w-5 animate-spin text-primary" /> : products.length ? <div className="space-y-2">{products.map((product: any) => { const active = selected[product.id] !== undefined; return <div key={product.id} className={`app-surface p-3 ${active ? "border-primary/30" : ""}`}><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-lg bg-white/[0.04]"><Package className="h-4 w-4 text-muted-foreground" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.name}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">Regular {product.price} {product.currency}</p></div><button onClick={() => toggle(product.id, product.price)} className={`grid h-10 w-10 place-items-center rounded-lg border ${active ? "border-primary bg-primary text-primary-foreground" : "border-white/[0.09] text-muted-foreground"}`}>{active ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />}</button></div>{active && <Field label="Sale price"><input value={selected[product.id]} onChange={(event) => setSelected({ ...selected, [product.id]: event.target.value })} type="number" min="0.01" step="0.01" className="mt-2 h-10 w-full rounded-lg border border-white/[0.09] bg-[#0d1015] px-3 font-mono text-xs outline-none focus:border-primary" /></Field>}</div>; })}</div> : <div className="app-surface p-10 text-center text-xs text-muted-foreground">No active products. Add inventory first.</div>}</section></div><div className="safe-bottom fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] border-t border-white/[0.08] bg-[#0b0e13]/95 p-3 backdrop-blur-xl"><button onClick={launch} disabled={saving || !token} className="min-h-12 w-full rounded-lg bg-primary font-mono text-xs font-bold uppercase tracking-[0.08em] text-primary-foreground disabled:opacity-40">{saving ? "Saving campaign…" : "Schedule sale"}</button></div></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="eyebrow mb-2 block">{label}</span>{children}</label>; }
function DateInput({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <div className="flex h-11 items-center gap-2 rounded-lg border border-white/[0.09] bg-[#0d1015] px-2"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /><input type="datetime-local" value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[10px] outline-none" /></div>; }
