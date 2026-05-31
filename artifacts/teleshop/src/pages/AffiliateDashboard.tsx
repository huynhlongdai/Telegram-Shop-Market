import { useGetMyAffiliate, useEnrollAffiliate } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, TrendingUp, Users, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AffiliateDashboard() {
  const { data: affiliate, isLoading, refetch } = useGetMyAffiliate();
  const { mutate: enroll, isPending } = useEnrollAffiliate();

  const handleEnroll = () => {
    enroll({}, {
      onSuccess: () => {
        toast({ title: "Successfully enrolled in affiliate program!" });
        refetch();
      }
    });
  };

  const copyLink = () => {
    if (affiliate?.referralCode) {
      navigator.clipboard.writeText(`https://t.me/teleshop_bot?start=${affiliate.referralCode}`);
      toast({ title: "Referral link copied!" });
    }
  };

  if (isLoading) {
    return <div className="p-4 space-y-4"><Skeleton className="h-40 w-full" /></div>;
  }

  if (!affiliate) {
    return (
      <div className="p-4 h-[calc(100vh-64px)] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
          <TrendingUp className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Earn Crypto with TeleShop</h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
            Share your unique link and earn 5% commission on all purchases made by your referrals.
          </p>
        </div>
        <Button className="w-full max-w-[280px] h-12 rounded-full text-base font-semibold" onClick={handleEnroll} disabled={isPending}>
          {isPending ? "Joining..." : "Join Affiliate Program"}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Affiliate Hub</h1>

      <div className="bg-gradient-to-br from-primary/20 to-blue-600/10 border border-primary/30 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <p className="text-sm font-medium text-primary uppercase tracking-wider">Total Earnings</p>
        <div className="text-4xl font-bold">{affiliate.totalEarned} <span className="text-xl text-muted-foreground">USDT</span></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <span className="text-2xl font-bold">0</span>
          <span className="text-xs text-muted-foreground">Total Referrals</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center gap-2">
          <Wallet className="w-5 h-5 text-muted-foreground" />
          <span className="text-2xl font-bold">0.00</span>
          <span className="text-xs text-muted-foreground">Pending Payout</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold">Your Referral Link</h2>
        <div className="flex gap-2">
          <div className="flex-1 bg-background border border-input rounded-lg px-3 py-3 text-sm font-mono text-muted-foreground truncate flex items-center">
            t.me/teleshop_bot?start={affiliate.referralCode}
          </div>
          <Button variant="secondary" className="px-4" onClick={copyLink}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Share this link to earn 5% on purchases.</p>
      </div>
    </div>
  );
}
