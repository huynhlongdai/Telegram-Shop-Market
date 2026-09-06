import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShieldCheck, Star, PackageCheck } from "lucide-react";
import { useCreateOrder, useGetProduct } from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

export default function CheckoutSteps() {
  const [, setLocation] = useLocation();
  const productId = Number(new URLSearchParams(window.location.search).get("productId") || 0);
  const { data: product, isLoading } = useGetProduct(productId, { query: { enabled: productId > 0 } });
  const [quantity, setQuantity] = useState(1);
  const [voucherCode, setVoucherCode] = useState("");
  const [accepted, setAccepted] = useState(false);
  const { mutate: createOrder, isPending } = useCreateOrder();
  const submit = () => { if (!product) return; createOrder({ data: { productId: product.id, quantity, voucherCode: voucherCode || undefined } }, { onSuccess: (order) => { toast({ title: "Order created", description: "Continue with the Telegram payment request." }); setLocation(`/orders/${order.id}`); }, onError: () => toast({ title: "Could not create order", variant: "destructive" }) }); };
  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading checkout…</div>;
  if (!product) return <div className="space-y-4 p-6 text-center"><p className="text-sm font-medium">No product selected</p><Link href="/" className="text-xs font-semibold text-primary">Return to marketplace</Link></div>;
  const total = Number(product.price) * quantity;
  return (
    <div className="pb-28">
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3"><Link href={`/product/${product.id}`} className="grid h-11 w-11 place-items-center rounded-lg border border-white/[0.09] bg-card"><ArrowLeft className="h-4 w-4" /></Link><div><p className="eyebrow mb-1">Secure checkout</p><p className="text-sm font-medium">Review purchase</p></div></div>
      <div className="space-y-6 px-4 py-5">
        <section className="app-surface p-4"><p className="eyebrow mb-2">Product</p><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/[0.08] text-primary"><PackageCheck className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h1 className="truncate text-sm font-semibold">{product.name}</h1><p className="mt-1 text-xs text-muted-foreground">Seller #{product.shopId} · {product.warrantyType} warranty</p></div><p className="mono-value text-sm font-semibold">{formatPrice(product.price)} {product.currency}</p></div></section>
        <section><p className="eyebrow mb-3">Order options</p><div className="app-surface divide-y divide-white/[0.07]"><div className="flex min-h-14 items-center justify-between p-3"><label className="text-sm font-medium" htmlFor="quantity">Quantity</label><div className="flex items-center gap-3"><button className="grid h-10 w-10 place-items-center rounded-md border border-white/[0.09]" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span id="quantity" className="w-6 text-center font-mono text-sm">{quantity}</span><button className="grid h-10 w-10 place-items-center rounded-md border border-white/[0.09]" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button></div></div><div className="p-3"><label className="eyebrow mb-2 block" htmlFor="voucher">Voucher code</label><Input id="voucher" value={voucherCode} onChange={(event) => setVoucherCode(event.target.value.toUpperCase())} placeholder="Optional" className="h-11 rounded-lg bg-[#0d1015] font-mono text-xs" /></div></div></section>
        <section className="app-surface overflow-hidden"><div className="flex items-center gap-3 border-b border-white/[0.07] p-4"><span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/[0.08] text-primary"><Star className="h-4 w-4" /></span><div><p className="text-sm font-medium">Telegram Stars</p><p className="mt-1 text-xs text-muted-foreground">Required for digital goods inside Telegram</p></div></div><div className="space-y-2 p-4"><Summary label="Subtotal" value={`${formatPrice(String(total))} ${product.currency}`} /><Summary label="Delivery" value="Automatic / seller managed" /><Summary label="Purchase record" value="Included" /><div className="mt-3 border-t border-white/[0.07] pt-3"><Summary label="Total" value={`${formatPrice(String(total))} ${product.currency}`} strong /></div></div></section>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/[0.08] p-4"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#c6ff3d]" /><span className="text-xs leading-5 text-muted-foreground">I reviewed the seller, warranty and delivery conditions. I understand the order becomes eligible for fulfillment only after payment confirmation.</span></label>
        <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Payment must be confirmed by the server. A client redirect alone never marks this order as paid.</div>
      </div>
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] border-t border-white/[0.08] bg-[#0b0e13]/95 p-3 backdrop-blur-xl"><Button onClick={submit} disabled={!accepted || isPending || quantity < 1} className="h-12 w-full rounded-lg font-mono text-xs font-bold uppercase tracking-[0.08em]">{isPending ? "Creating order…" : "Create order & pay"}</Button></div>
    </div>
  );
}
function Summary({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) { return <div className="flex items-center justify-between gap-4"><span className="text-xs text-muted-foreground">{label}</span><span className={`text-right text-xs ${strong ? "mono-value text-sm font-semibold text-primary" : "font-medium"}`}>{value}</span></div>; }
