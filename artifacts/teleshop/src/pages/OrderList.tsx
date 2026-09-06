import { useState } from "react";
import { Link } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ArrowRight, Clock3, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const filters = ["all", "pending", "completed", "disputed"] as const;

export default function OrderList() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const { data: orders, isLoading } = useListOrders(filter === "all" ? undefined : { status: filter });
  return (
    <div className="space-y-6 px-4 py-5">
      <section><p className="eyebrow mb-3">Purchase history</p><h1 className="text-[28px] font-semibold tracking-[-0.04em]">{t("orders.title")}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Payment, fulfillment and dispute events in one record.</p></section>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Order status filters">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`min-h-10 shrink-0 rounded-md border px-3 text-xs font-medium capitalize ${filter === item ? "border-primary bg-primary text-primary-foreground" : "border-white/[0.09] bg-card text-muted-foreground"}`}>{item}</button>)}</div>
      {isLoading ? <div className="space-y-3">{[1,2,3].map((item) => <Skeleton key={item} className="h-[116px] rounded-[10px]" />)}</div> : !orders?.items.length ? <div className="app-surface px-6 py-12 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-white/[0.04]"><Package className="h-5 w-5 text-muted-foreground" /></span><h2 className="mt-4 text-sm font-semibold">{t("orders.noOrdersTitle")}</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">{t("orders.noOrdersSubtext")}</p><Link href="/" className="mt-5 inline-flex min-h-11 items-center text-xs font-semibold text-primary">{t("orders.startShopping")} <ArrowRight className="ml-2 h-4 w-4" /></Link></div> : <div className="space-y-3">{orders.items.map((order) => <OrderCard key={order.id} order={order} />)}</div>}
    </div>
  );
}

function OrderCard({ order }: { order: NonNullable<ReturnType<typeof useListOrders>["data"]>["items"][number] }) {
  const isRisk = order.status === "disputed" || order.status === "cancelled";
  const isDone = order.status === "completed" || order.status === "delivered";
  const Icon = isRisk ? AlertTriangle : isDone ? CheckCircle2 : Clock3;
  return <Link href={`/orders/${order.id}`} className="app-surface group block p-4 transition-colors hover:border-white/[0.16]"><div className="flex items-center justify-between gap-3"><div><p className="eyebrow mb-1.5">Order #{order.id}</p><p className="mono-value text-base font-semibold">{formatPrice(order.totalAmount)} {order.currency}</p></div><span className={`flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] ${isRisk ? "border-red-400/20 bg-red-400/[0.06] text-red-300" : isDone ? "border-primary/20 bg-primary/[0.06] text-primary" : "border-amber-400/20 bg-amber-400/[0.06] text-amber-300"}`}><Icon className="h-3 w-3" />{order.status}</span></div><div className="mt-4 flex items-center gap-3 border-t border-white/[0.07] pt-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04]"><Package className="h-4 w-4 text-muted-foreground" /></span><div className="min-w-0 flex-1"><p className="text-xs font-medium">Product #{order.productId} · Qty {order.quantity}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p></div><ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></div></Link>;
}
