import { useState } from "react";
import { 
  ArrowLeft, 
  Copy, 
  TrendingUp, 
  Info, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  ExternalLink 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AffiliateDashboard() {
  const [payoutsExpanded, setPayoutsExpanded] = useState(false);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#0F0F0F] text-white font-sans overflow-hidden border border-zinc-800 rounded-3xl shadow-2xl relative mx-auto flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-1 -ml-1 hover:bg-zinc-800 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight">Affiliate Program</h1>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-0 font-bold px-2 py-0.5 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:from-amber-400 hover:to-yellow-300">
            KOL Partner
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-12">
        <div className="p-4 space-y-6">
          
          {/* Earnings Hero */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#1a1a1a] rounded-2xl border border-zinc-800" />
            <div className="absolute -inset-0.5 bg-gradient-to-b from-[#22c55e]/10 to-transparent blur opacity-50 rounded-2xl" />
            
            <div className="relative p-5 flex flex-col items-center text-center space-y-4">
              <div className="space-y-1">
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Earned</p>
                <div className="text-4xl font-black tracking-tighter text-[#22c55e] drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]">
                  247.80 <span className="text-2xl text-[#22c55e]/80">USDT</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#22c55e]/10 px-3 py-1.5 rounded-full border border-[#22c55e]/20 text-[#22c55e] text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                This month: +89.50 USDT (+36%)
              </div>

              <div className="w-full h-px bg-zinc-800 my-2" />

              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <p className="text-zinc-500 text-xs font-medium">Pending payout</p>
                  <p className="text-zinc-300 font-semibold">34.20 USDT</p>
                </div>
                <Button className="bg-[#2481cc] hover:bg-[#3290dc] text-white rounded-xl shadow-[0_0_15px_rgba(36,129,204,0.3)]">
                  Withdraw Now
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Referrals", value: "143" },
              { label: "Orders", value: "89" },
              { label: "Conv. rate", value: "62%" },
              { label: "Avg order", value: "2.8 TON" },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-center">
                <span className="text-zinc-500 text-xs font-medium mb-1">{stat.label}</span>
                <span className="text-zinc-100 font-bold text-lg tracking-tight">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Commission Tiers */}
          <div className="space-y-3">
            <h2 className="text-zinc-100 font-semibold flex items-center justify-between">
              Commission Tiers
              <Info className="w-4 h-4 text-zinc-500" />
            </h2>
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden text-sm">
              <div className="divide-y divide-zinc-800/50">
                <div className="flex justify-between p-3 text-zinc-400">
                  <span>Standard</span>
                  <span className="font-mono">5% per order</span>
                </div>
                <div className="flex justify-between p-3 bg-amber-500/10 border-l-2 border-l-amber-500 text-amber-50 font-medium relative">
                  <span className="flex items-center gap-2">
                    KOL (you)
                  </span>
                  <span className="font-mono text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">8% per order</span>
                </div>
                <div className="flex justify-between p-3 text-zinc-500">
                  <span>Enterprise</span>
                  <span className="font-mono">Custom</span>
                </div>
              </div>
            </Card>
            <p className="text-[11px] text-zinc-500 px-1 text-center">
              Upgrade requires Telegram channel &gt;10K members
            </p>
          </div>

          {/* Referral Links */}
          <div className="space-y-3">
            <h2 className="text-zinc-100 font-semibold">My Referral Links</h2>
            <div className="space-y-3">
              {[
                { label: "Main shop link", url: "t.me/TeleShopBot?r=kol_abc123", stats: "847 clicks • 52 orders • 41.6 USDT earned", sparks: "M0,10 L10,12 L20,8 L30,15 L40,5 L50,18 L60,2 L70,10 L80,0 L90,8 L100,2" },
                { label: "iPhone Cases promo", url: "t.me/TeleShopBot?r=kol_cases", stats: "215 clicks • 14 orders • 12.4 USDT earned", sparks: "M0,15 L10,14 L20,18 L30,12 L40,8 L50,15 L60,10 L70,2 L80,6 L90,14 L100,8" }
              ].map((link, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-zinc-200 font-medium text-sm">{link.label}</span>
                    <div className="w-[60px] h-[20px]">
                      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <path d={link.sparks} fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-zinc-800/80">
                    <span className="text-zinc-400 font-mono text-xs flex-1 truncate">{link.url}</span>
                    <button className="text-[#2481cc] hover:text-[#3290dc] p-1 bg-[#2481cc]/10 rounded-md transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <p className="text-zinc-500 text-[11px]">{link.stats}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl h-10 border-dashed">
              <Plus className="w-4 h-4 mr-2" />
              Create New Link
            </Button>
          </div>

          {/* Recent Commissions */}
          <div className="space-y-3">
            <h2 className="text-zinc-100 font-semibold">Recent Commissions</h2>
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <div className="divide-y divide-zinc-800/50">
                {[
                  { id: "#8821", product: "iPhone 15 Case x2", amount: "5.0 TON", earn: "+0.40 USDT", date: "May 29" },
                  { id: "#8819", product: "Wireless Charger Pad", amount: "2.4 TON", earn: "+0.19 USDT", date: "May 29" },
                  { id: "#8794", product: "Screen Protector Glass", amount: "1.1 TON", earn: "+0.08 USDT", date: "May 28" },
                  { id: "#8782", product: "USB-C to Lightning Cable", amount: "1.5 TON", earn: "+0.12 USDT", date: "May 28" },
                  { id: "#8755", product: "AirPods Pro Case Silicone", amount: "2.0 TON", earn: "+0.16 USDT", date: "May 27" },
                ].map((order, i) => (
                  <div key={i} className="p-3 text-sm flex justify-between items-center group cursor-pointer hover:bg-zinc-800/30 transition-colors">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 font-mono text-xs">{order.id}</span>
                        <span className="text-zinc-300 truncate max-w-[120px]">{order.product}</span>
                      </div>
                      <div className="text-zinc-600 text-xs">
                        Order: {order.amount} • {order.date}
                      </div>
                    </div>
                    <div className="text-right pl-2">
                      <span className="text-[#22c55e] font-medium font-mono whitespace-nowrap">{order.earn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Payout History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button 
              className="w-full p-4 flex items-center justify-between text-zinc-300 hover:bg-zinc-800/50 transition-colors"
              onClick={() => setPayoutsExpanded(!payoutsExpanded)}
            >
              <span className="text-sm font-medium">3 previous payouts</span>
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                Tap to expand
                {payoutsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </button>
            
            {payoutsExpanded && (
              <div className="border-t border-zinc-800 bg-zinc-950 p-3 divide-y divide-zinc-800/50">
                {[
                  { date: "May 01", amount: "185.20 USDT", tx: "Tx...9a4f" },
                  { date: "Apr 01", amount: "142.50 USDT", tx: "Tx...2b8c" },
                  { date: "Mar 01", amount: "98.10 USDT", tx: "Tx...7d1e" },
                ].map((payout, i) => (
                  <div key={i} className="flex justify-between items-center py-2 text-sm">
                    <span className="text-zinc-400">{payout.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-200 font-mono">{payout.amount}</span>
                      <a href="#" className="text-[#2481cc] flex items-center gap-1 text-xs hover:underline">
                        {payout.tx} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Notice */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex gap-3 items-start">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Commissions credited after buyer confirms delivery (7-day auto-confirm). Minimum withdrawal is 10 USDT.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
