import { useGetProduct } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Store, ShieldCheck, ShieldOff, Clock, Zap, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ProductDetail() {
  const { productId } = useParams();
  const { data: product, isLoading } = useGetProduct(Number(productId || 0));
  if (isLoading) return <div className="space-y-4 p-4"><Skeleton className="h-11 w-11 rounded-lg" /><Skeleton className="aspect-[4/3] w-full rounded-xl" /><Skeleton className="h-28 w-full rounded-xl" /><Skeleton className="h-36 w-full rounded-xl" /></div>;
  if (!product) return <div className="p-8 text-center text-sm text-muted-foreground">Product not found</div>;
  return (
    <div className="pb-28">
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3"><Link href="/" className="grid h-11 w-11 place-items-center rounded-lg border border-white/[0.09] bg-card" aria-label="Back to marketplace"><ArrowLeft className="h-4 w-4" /></Link><div><p className="eyebrow mb-1">Product details</p><p className="max-w-[280px] truncate text-sm font-medium">{product.name}</p></div></div>
      <div className="space-y-6 px-4 py-5">
        <div className="app-surface overflow-hidden"><div className="aspect-[4/3] bg-[#0d1015]">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-mono text-xs text-muted-foreground">DIGITAL PRODUCT</div>}</div><div className="border-t border-white/[0.07] p-4"><p className="eyebrow mb-2">{product.category || "Digital product"}</p><h1 className="text-2xl font-semibold leading-tight tracking-[-0.035em]">{product.name}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{product.description || "The seller has not added a description yet."}</p></div></div>
        <section><div className="mb-3 flex items-end justify-between"><div><p className="eyebrow mb-1.5">Available offer</p><h2 className="text-lg font-semibold tracking-[-0.025em]">Seller and protection</h2></div><span className="font-mono text-[10px] text-muted-foreground">1 OFFER</span></div><div className="app-surface overflow-hidden"><Link href={`/shop/${product.shopId}`} className="flex min-h-16 items-center gap-3 border-b border-white/[0.07] p-3 hover:bg-white/[0.02]"><span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Store className="h-4 w-4" /></span><span className="flex-1"><span className="block text-sm font-medium">Shop #{product.shopId}</span><span className="mt-0.5 block text-xs text-muted-foreground">Transaction history available</span></span><Check className="h-4 w-4 text-primary" /></Link><div className="grid grid-cols-3 divide-x divide-white/[0.07] p-1"><Metric label="Delivery" value="Tracked" icon={Zap} /><Metric label="Stock" value={String(product.stock)} icon={Clock} /><Metric label="Payment" value={product.currency} icon={ShieldCheck} /></div></div></section>
        {product.warrantyType === "none" ? <div className="flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-4"><ShieldOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /><div><p className="text-sm font-medium">No seller warranty</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Settlement is released after {product.escrowReleaseDays} day(s). Review the offer before paying.</p></div></div> : <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/[0.05] p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-sm font-medium">Purchase protection</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Delivery and order events are recorded for support and dispute review.</p></div></div>}
      </div>
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] border-t border-white/[0.08] bg-[#0b0e13]/95 p-3 backdrop-blur-xl"><div className="flex items-center gap-3"><div className="min-w-0 flex-1"><p className="eyebrow mb-1">Total</p><p className="mono-value truncate text-lg font-semibold">{formatPrice(product.price)} <span className="text-sm text-muted-foreground">{product.currency}</span></p></div><Link href={`/checkout?productId=${product.id}`} className="shrink-0"><Button className="h-12 min-w-[176px] rounded-lg px-5 font-mono text-xs font-bold uppercase tracking-[0.08em]">Continue to pay</Button></Link></div></div>
    </div>
  );
}
function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Zap }) { return <div className="px-2 py-3 text-center"><Icon className="mx-auto mb-2 h-4 w-4 text-primary" /><p className="eyebrow mb-1">{label}</p><p className="mono-value truncate text-[11px] font-medium">{value}</p></div>; }
