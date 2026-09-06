import { useGetMyAffiliate, useEnrollAffiliate } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Share2, Users, Wallet, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AffiliateDashboard() {
  const { data: affiliate, isLoading, refetch } = useGetMyAffiliate();
  const { mutate: enroll, isPending } = useEnrollAffiliate();
  const handleEnroll = () => enroll(undefined, { onSuccess: () => { toast({ title: "Affiliate account activated" }); refetch(); } });
  const referralUrl = affiliate ? `{{https://t.me/teleshop_bot?start=${affiliate.referralCode}}}` : "";
  const copyLink = async () => { await navigator.clipboard.writeText(referralUrl); toast({ title: "Referral link copied" }); };
  if (isLoading) return <div className="space-y-3 p-4"><Skeleton className="h-32 rounded-xl" /><Skeleton className="h-44 rounded-xl" /></div>;
  if (!affiliate) return <div className="flex min-h-[calc(100dvh-140px)] flex-col justify-center px-5 py-10"><span className="grid h-12 w-12 place-items-center rounded-lg border border-primary/20 bg-primary/[0.06] text-primary"><Share2 className="h-5 w-5" /></span><p className="eyebrow mb-3 mt-6">Distribution network</p><h1 className="max-w-[330px] text-[30px] font-semibold leading-[1.08] tracking-[-0.045em]">Earn commission by bringing verified buyers.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Receive a unique Telegram referral link and track attributed purchases from one ledger.</p><div className="app-surface mt-6 space-y-3 p-4"><Benefit text="Attribution tied to your referral code" /><Benefit text="Commission and payout records remain visible" /><Benefit text="No inventory required for affiliate mode" /></div><Button className="mt-5 h-12 rounded-lg font-mono text-xs font-bold uppercase tracking-[0.08em]" onClick={handleEnroll} disabled={isPending}>{isPending ? "Activating..." : "Activate affiliate account"}</Button></div>;
  return (
    <div className="space-y-6 px-4 py-5">
      <section><div className="mb-3 flex items-center justify-between"><p className="eyebrow">Affiliate console</p><span className="rounded-md border border-primary/20 bg-primary/[0.06] px-2 py-1 font-mono text-[9px] uppercase text-primary">{affiliate.status}</span></div><h1 className="text-[28px] font-semibold tracking-[-0.04em]">Distribution ledger</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Track referrals, earned commission and pending settlement.</p></section>
      <section className="app-surface overflow-hidden"><div className="border-b border-white/[0.07] p-4"><p className="eyebrow mb-2">Total earned</p><p className="mono-value text-[28px] font-semibold tracking-[-0.04em]">{affiliate.totalEarned} <span className="text-sm text-muted-foreground">USDT</span></p></div><div className="grid grid-cols-2 divide-x divide-white/[0.07] p-1"><Metric icon={Users} label="Referrals" value={String(affiliate.totalReferrals)} /><Metric icon={Wallet} label="Pending" value={affiliate.pendingPayout} /></div></section>
      <section><div className="mb-3"><p className="eyebrow mb-1.5">Distribution</p><h2 className="text-lg font-semibold">Your referral link</h2></div><div className="app-surface p-4"><div className="app-inset flex min-h-12 items-center gap-2 px-3"><span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">{referralUrl}</span><button onClick={copyLink} className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-white/[0.09] text-primary" aria-label="Copy referral link"><Copy className="h-4 w-4" /></button></div><p className="mt-3 text-xs leading-5 text-muted-foreground">Commission applies only when attribution is recorded successfully.</p></div></section>
      <button onClick={copyLink} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-mono text-xs font-bold uppercase tracking-[0.08em] text-primary-foreground">Copy and share <ArrowRight className="h-4 w-4" /></button>
    </div>
  );
}
function Benefit({ text }: { text: string }) { return <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{text}</div>; }
function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) { return <div className="p-4 text-center"><Icon className="mx-auto mb-2 h-4 w-4 text-primary" /><p className="eyebrow mb-1.5">{label}</p><p className="mono-value text-base font-semibold">{value}</p></div>; }
