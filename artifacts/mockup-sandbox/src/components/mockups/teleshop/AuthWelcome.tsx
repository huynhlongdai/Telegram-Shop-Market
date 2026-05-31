import { Button } from "@/components/ui/button";
import { Send, Store, Wallet, ShieldCheck, ArrowRight } from "lucide-react";

export function AuthWelcome() {
  return (
    <div className="relative w-[390px] h-[844px] overflow-hidden bg-[#0A0F1E] text-white flex flex-col font-sans border border-white/10 rounded-[40px] shadow-2xl mx-auto my-8">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-[#0098EA]/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-20%] w-[250px] h-[250px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[30%] left-[-10%] w-[200px] h-[200px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-10 px-6 flex flex-col items-center text-center space-y-4 flex-shrink-0">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0098EA] to-purple-600 p-[2px] mb-2 shadow-[0_0_30px_rgba(0,152,234,0.3)]">
          <div className="w-full h-full bg-[#0A0F1E] rounded-[14px] flex items-center justify-center">
            <span className="text-3xl font-bold bg-gradient-to-br from-[#0098EA] to-purple-500 bg-clip-text text-transparent">
              T
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">TeleShop</h1>
        <p className="text-slate-400 text-[15px] leading-relaxed max-w-[260px]">
          The crypto marketplace inside Telegram
        </p>
      </div>

      {/* Value Prop */}
      <div className="relative z-10 px-8 py-6 space-y-6 flex-shrink-0 flex-1">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
            <Store className="w-5 h-5 text-[#0098EA]" />
          </div>
          <span className="text-[15px] font-medium text-slate-200">Shop from 800+ verified stores</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
            <Wallet className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-[15px] font-medium text-slate-200">Pay instantly with TON & USDT</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-[15px] font-medium text-slate-200">Buyer protection with escrow</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 p-6 flex flex-col mt-auto bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E] to-transparent pt-12">
        <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
          <p className="text-sm text-slate-400 font-medium mb-1">Continue with Telegram</p>
          
          <Button className="w-full h-14 rounded-2xl bg-[#0098EA] hover:bg-[#007BB5] text-white font-bold text-lg transition-all shadow-[0_8px_20px_rgba(0,152,234,0.3)]">
            <Send className="w-5 h-5 mr-2 -ml-1" />
            Sign in with Telegram
          </Button>
          
          <p className="text-[13px] text-slate-500 mb-2">We use your Telegram identity — no password required</p>

          <div className="flex items-center w-full gap-4 my-2">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">or</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 text-white hover:bg-white/5 bg-transparent hover:text-white font-medium">
            Browse as Guest
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-1">
          <p className="text-sm text-slate-400">Want to sell on TeleShop?</p>
          <button className="text-[#0098EA] font-semibold text-sm flex items-center hover:text-white transition-colors">
            Open a Shop <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="mt-8 text-center pb-2">
          <p className="text-[11px] text-slate-600">
            By continuing you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
