import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RegisterShop() {
  return (
    <div className="min-h-[100dvh] bg-[#0f0f0f] text-gray-100 font-sans w-full max-w-[390px] mx-auto relative overflow-y-auto pb-12 selection:bg-amber-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 mb-1">
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight text-white">Open Your Shop</h1>
        </div>
        <p className="text-xs text-gray-400 font-medium pl-9 uppercase tracking-wider">Step 1 of 5 — Choose Plan</p>
      </header>

      <main className="px-4 pt-6 pb-8 space-y-6">
        
        {/* Intro */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-white leading-tight">Pay once, sell forever. <br/><span className="text-gray-400">Upgrade anytime.</span></h2>
        </div>

        {/* Plans */}
        <div className="space-y-4">
          
          {/* Starter Card */}
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 flex flex-col transition-transform hover:scale-[1.01]">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="secondary" className="bg-gray-800 text-gray-300 hover:bg-gray-800 border-none font-medium px-2.5 py-0.5">Starter</Badge>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">30</span>
                <span className="text-sm font-medium text-gray-400">USDT</span>
                <span className="text-xs text-gray-500 ml-1">one-time</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">+ 5 USDT/month</div>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              {[
                "Up to 50 products",
                "100 orders/month",
                "Basic analytics",
                "Marketplace listing"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white transition-colors bg-transparent h-12 rounded-xl font-semibold">
              Choose Starter
            </Button>
          </div>

          {/* Growth Card (HERO) */}
          <div className="bg-gradient-to-b from-[#1a1500] to-[#121005] border border-amber-500/30 rounded-2xl p-5 flex flex-col relative shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20 transform scale-[1.02] z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg shadow-amber-500/20">
                Most Popular
              </span>
            </div>
            <div className="flex justify-between items-start mb-4 mt-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20 font-medium px-2.5 py-0.5">Growth</Badge>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">80</span>
                <span className="text-sm font-medium text-amber-500/70">USDT</span>
                <span className="text-xs text-amber-500/50 ml-1">one-time</span>
              </div>
              <div className="text-sm text-amber-500/70 mt-1">+ 15 USDT/month</div>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              {[
                "Up to 500 products",
                "Unlimited orders",
                "CRM + Customer broadcast (500/mo)",
                "Flash sale tools",
                "Featured in marketplace 3 days/month",
                "Priority support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-amber-50/90">
                  <Check className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-[#0098EA] hover:bg-[#0089d3] text-white transition-colors h-12 rounded-xl font-bold shadow-lg shadow-[#0098EA]/20 border-none">
              Choose Growth
            </Button>
          </div>

          {/* Pro Card */}
          <div className="bg-[#150f1a] border border-purple-500/20 rounded-2xl p-5 flex flex-col transition-transform hover:scale-[1.01]">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20 font-medium px-2.5 py-0.5">Pro</Badge>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">200</span>
                <span className="text-sm font-medium text-purple-400/70">USDT</span>
                <span className="text-xs text-purple-400/50 ml-1">one-time</span>
              </div>
              <div className="text-sm text-purple-400/70 mt-1">+ 30 USDT/month</div>
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              {[
                "Everything in Growth",
                "Unlimited products & orders",
                "Unlimited broadcast",
                "Advanced analytics & export",
                "Featured 7 days/month",
                "Dedicated account manager",
                "Custom bot name (Enterprise add-on)"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-purple-50/80">
                  <Check className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors h-12 rounded-xl font-semibold border-none">
              Choose Pro
            </Button>
          </div>
        </div>

        {/* Compare link */}
        <div className="text-center py-2">
          <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors underline-offset-4 hover:underline">
            See full feature comparison
          </button>
        </div>

        {/* Payment Info Card */}
        <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5 space-y-4">
          <h3 className="text-sm font-medium text-white">All plans paid in crypto</h3>
          
          <div className="flex items-center gap-4 text-xs font-medium text-gray-300">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <div className="w-4 h-4 bg-[#0098EA] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 border-[1.5px] border-white rotate-45"></div>
              </div>
              <span>TON</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <div className="w-4 h-4 bg-[#26A17B] rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 border-[1.5px] border-white rounded-full"></div>
              </div>
              <span>USDT-TON</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <div className="w-4 h-4 bg-[#26A17B] rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 border-[1.5px] border-white rounded-full"></div>
              </div>
              <span>USDT-TRC20</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed">
            One-time setup fee paid now. Monthly fee auto-billed via TON Connect.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="flex items-center justify-center gap-3 text-[11px] font-medium text-gray-500 pb-4">
          <span>847 active shops</span>
          <div className="w-1 h-1 rounded-full bg-gray-700"></div>
          <span>No hidden fees</span>
          <div className="w-1 h-1 rounded-full bg-gray-700"></div>
          <span>Cancel anytime</span>
        </div>

      </main>
    </div>
  );
}
