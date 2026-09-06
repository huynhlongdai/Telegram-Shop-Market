import { Link } from "wouter";
import { useGetMyShop } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingBag, Settings, Zap, Tag, ArrowRight, Activity, ShieldCheck, Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

const actions = [
  { href: "/dashboard/orders", icon: ShoppingBag, title: "Order queue", note: "Review and fulfill purchases" },
  { href: "/dashboard/products", icon: Package, title: "Catalog & offers", note: "Manage price, stock and delivery" },
  { href: "/dashboard/settings", icon: Bot, title: "Bot & fulfillment", note: "API, notifications and automation" },
  { href: "/dashboard/vouchers", icon: Tag, title: "Promotions", note: "Vouchers and reseller campaigns" },
];

export default function MerchantDashboard() {
  const { t } = useTranslation();
  const { data: shop, isLoading } = useGetMyShop();
  if (isLoading) return <div className="space-y-3 p-4"><Skeleton className="h-28 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-20 rounded-xl" /><Skeleton className="h-20 rounded-xl" /></div>;
  return (
    <div className="space-y-7 px-4 py-5">
      <section><div className="mb-3 flex items-center justify-between"><p className="eyebrow">Merchant console</p><span className="flex items-center gap-2 font-mono text-[10px] text-primary"><span className="status-dot" /> LIVE</span></div><h1 className="text-[28px] font-semibold tracking-[-0.04em]">{shop?.name || t("dashboard.title")}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Operate orders, offers and automated delivery from one queue.</p></section>
      <section className="app-surface overflow-hidden"><div className="flex items-center justify-between border-b border-white/[0.07] p-4"><div><p className="eyebrow mb-2">Operations</p><p className="text-sm font-medium">System readiness</p></div><Activity className="h-5 w-5 text-primary" /></div><div className="grid grid-cols-3 divide-x divide-white/[0.07] p-1"><Health label="Shop" value={shop?.status || "pending"} icon={ShieldCheck} /><Health label="Catalog" value="Ready" icon={Package} /><Health label="Bot" value={shop?.botToken ? "Linked" : "Setup"} icon={Bot} /></div></section>
      <section><div className="mb-3 flex items-end justify-between"><div><p className="eyebrow mb-1.5">Work queue</p><h2 className="text-lg font-semibold tracking-[-0.025em]">Merchant tools</h2></div><Settings className="h-4 w-4 text-muted-foreground" /></div><div className="space-y-2">{actions.map(({ href, icon: Icon, title, note }) => <Link key={href} href={href} className="app-surface group flex min-h-[76px] items-center gap-3 p-3 transition-colors hover:border-white/[0.16]"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/[0.08] text-primary"><Icon className="h-[18px] w-[18px]" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{note}</span></span><ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></Link>)}</div></section>
      <section><p className="eyebrow mb-3">Campaigns</p><Link href="/dashboard/flash-sales" className="flex min-h-[72px] items-center gap-3 rounded-lg border border-amber-400/15 bg-amber-400/[0.05] p-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400/10 text-amber-300"><Zap className="h-4 w-4" /></span><span className="flex-1"><span className="block text-sm font-medium">Flash sales</span><span className="mt-1 block text-xs text-muted-foreground">Schedule time-limited offer pricing</span></span><ArrowRight className="h-4 w-4 text-muted-foreground" /></Link></section>
    </div>
  );
}
function Health({ label, value, icon: Icon }: { label: string; value: string; icon: typeof ShieldCheck }) { return <div className="px-2 py-3 text-center"><Icon className="mx-auto mb-2 h-4 w-4 text-primary" /><p className="eyebrow mb-1">{label}</p><p className="mono-value truncate text-[11px] font-medium capitalize">{value}</p></div>; }
