import { useParams, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock3, CheckCircle2, ShieldAlert, Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

const steps = [
  { key: "pending", label: "Order created", note: "Waiting for payment confirmation" },
  { key: "confirmed", label: "Payment confirmed", note: "Fulfillment can now begin" },
  { key: "shipped", label: "Fulfillment sent", note: "Delivery data has been issued" },
  { key: "completed", label: "Order completed", note: "Settlement record is finalized" },
];

export default function OrderDetail() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useGetOrder(Number(orderId) || 0, { query: { enabled: !!orderId } });
  const copy = async (value: string) => { await navigator.clipboard.writeText(value); toast({ title: "Copied to clipboard" }); };
  if (isLoading) return <div className="space-y-4 p-4"><Skeleton className="h-12 rounded-lg" /><Skeleton className="h-64 rounded-xl" /><Skeleton className="h-44 rounded-xl" /></div>;
  if (!order) return <div className="p-8 text-center text-sm text-muted-foreground">Order not found</div>;
  const current = order.status === "delivered" ? 2 : steps.findIndex((step) => step.key === order.status);
  const isDisputed = order.status === "disputed";
  return (
    <div className="pb-6">
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3"><Link href="/orders" className="grid h-11 w-11 place-items-center rounded-lg border border-white/[0.09] bg-card"><ArrowLeft className="h-4 w-4" /></Link><div className="min-w-0 flex-1"><p className="eyebrow mb-1">Order record</p><p className="truncate text-sm font-medium">#{order.id}</p></div><span className="rounded-md border border-white/[0.09] px-2 py-1 font-mono text-[9px] uppercase text-muted-foreground">{order.status}</span></div>
      <div className="space-y-6 px-4 py-5">
        {isDisputed && <div className="flex gap-3 rounded-lg border border-red-400/20 bg-red-400/[0.06] p-4"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-300" /><div><p className="text-sm font-medium">This order is disputed</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Settlement is paused while evidence is reviewed.</p></div></div>}
        <section className="app-surface p-4"><div className="mb-5 flex items-end justify-between"><div><p className="eyebrow mb-1.5">Timeline</p><h1 className="text-lg font-semibold">Fulfillment status</h1></div><Clock3 className="h-4 w-4 text-muted-foreground" /></div><div>{steps.map((step, index) => { const done = current >= index; return <div key={step.key} className="relative flex gap-3 pb-6 last:pb-0"><div className={`absolute left-[9px] top-5 h-full w-px ${done && current > index ? "bg-primary/40" : "bg-white/[0.08]"}`} /><span className={`relative z-10 mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${done ? "border-primary bg-primary text-primary-foreground" : "border-white/[0.12] bg-card text-muted-foreground"}`}>{done ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}</span><div><p className={`text-sm font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p><p className="mt-1 text-xs text-muted-foreground">{index === 0 ? new Date(order.createdAt).toLocaleString() : step.note}</p></div></div>; })}</div></section>
        <section className="app-surface overflow-hidden"><div className="border-b border-white/[0.07] p-4"><p className="eyebrow mb-1.5">Summary</p><h2 className="text-lg font-semibold">Order details</h2></div><div className="p-4"><Row label="Product" value={`#${order.productId}`} /><Row label="Quantity" value={String(order.quantity)} /><Row label="Payment" value={`${formatPrice(order.totalAmount)} ${order.currency}`} strong /><Row label="Settlement" value={order.escrowStatus} /><Row label="Warranty" value={order.warrantyType} />{order.deliveryAddress && <Row label="Delivery data" value={order.deliveryAddress} />}</div></section>
        {order.txHash && <button onClick={() => copy(order.txHash!)} className="app-surface flex min-h-14 w-full items-center gap-3 p-3 text-left"><ExternalLink className="h-4 w-4 text-primary" /><span className="min-w-0 flex-1"><span className="eyebrow mb-1 block">Transaction reference</span><span className="block truncate font-mono text-xs">{order.txHash}</span></span><Copy className="h-4 w-4 text-muted-foreground" /></button>}
        <Link href={`/orders/${order.id}/dispute`} className="flex min-h-11 items-center justify-center text-xs font-medium text-muted-foreground hover:text-foreground">Report a delivery problem</Link>
      </div>
    </div>
  );
}
function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) { return <div className="flex min-h-11 items-center justify-between gap-4 border-b border-white/[0.06] last:border-0"><span className="text-xs text-muted-foreground">{label}</span><span className={`max-w-[220px] truncate text-right text-xs capitalize ${strong ? "mono-value font-semibold text-primary" : "font-medium"}`}>{value}</span></div>; }
