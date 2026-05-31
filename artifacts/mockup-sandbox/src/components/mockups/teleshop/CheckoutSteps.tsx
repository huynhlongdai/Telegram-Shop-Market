import { useState } from "react";
import { ChevronDown, ChevronLeft, Pencil, Lock, Info, Check, Wallet, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CheckoutSteps() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center bg-zinc-950 min-h-screen font-sans text-zinc-50">
      <div className="w-full max-w-[390px] bg-zinc-950 shadow-2xl relative flex flex-col h-[100dvh]">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
          <button className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold">Checkout</h1>
          <span className="text-xs font-medium text-zinc-400 bg-zinc-900 px-2 py-1 rounded-full">3 / 3</span>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-32 space-y-4 p-4">
          
          {/* Zone 1 - Order Summary */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-800/20 transition-colors">
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm font-medium">Order Summary (2 items)</span>
                <span className="text-xs text-zinc-400">Total: 6.7 TON ≈ $19.43 USD</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 pt-0 space-y-3 border-t border-zinc-800/50 mt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Premium Telegram Username</span>
                  <span>5.0 TON</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Exclusive Sticker Pack</span>
                  <span>1.5 TON</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Zone 2 - Delivery Info */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-sm font-semibold mb-3">Delivery</h2>
              <div className="flex items-start justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Nguyễn Văn A</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">123 Lê Lợi, Q.1, TP.HCM</p>
                </div>
                <button className="p-1.5 text-zinc-400 hover:text-zinc-50 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">Shipping Method</h3>
              <RadioGroup defaultValue="discuss" className="gap-3">
                <div className="flex items-center space-x-3 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
                  <RadioGroupItem value="discuss" id="discuss" className="border-zinc-700 text-[#0098EA]" />
                  <Label htmlFor="discuss" className="flex-1 cursor-pointer">
                    <span className="block text-sm font-medium">Discuss with seller</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">Custom arrangement</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 opacity-60">
                  <RadioGroupItem value="express" id="express" className="border-zinc-700" />
                  <Label htmlFor="express" className="flex-1 cursor-pointer flex justify-between items-center">
                    <span className="block text-sm">Express</span>
                    <span className="text-xs font-medium">+5 USDT</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Note to seller</h3>
              <Textarea 
                placeholder="Add a note..." 
                className="bg-zinc-950 border-zinc-800 resize-none min-h-[80px] text-sm focus-visible:ring-[#0098EA]/50"
              />
            </div>
          </div>

          {/* Zone 3 - Payment */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg shadow-[#0098EA]/5">
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-sm font-semibold mb-3">Payment</h2>
              <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <Wallet className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium">Tonkeeper: UQAb...x7Kp</span>
                </div>
                <button className="text-xs font-medium text-[#0098EA] hover:text-[#0098EA]/80 transition-colors">
                  Change
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3 border-b border-zinc-800">
              <div className="flex items-center justify-between bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  <span className="text-xs font-medium">Voucher: SAVE10 applied</span>
                </div>
                <span className="text-xs font-bold">-0.65 TON</span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span>6.5 TON</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400 flex items-center gap-1">Platform fee (2%) <Info className="w-3 h-3" /></span>
                  <span>0.13 TON</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400 flex items-center gap-1">Estimated gas <Info className="w-3 h-3" /></span>
                  <span>~0.01 TON</span>
                </div>
              </div>
              
              <div className="pt-3 mt-3 border-t border-zinc-800 border-dashed">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium">TOTAL</span>
                  <div className="text-right">
                    <span className="block text-xl font-bold tracking-tight text-[#0098EA]">6.64 TON</span>
                    <span className="block text-xs text-zinc-500">≈ $19.26 USD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0098EA]/5">
              <div className="flex items-start gap-3 bg-[#0098EA]/10 p-3 rounded-xl border border-[#0098EA]/20">
                <Lock className="w-4 h-4 text-[#0098EA] shrink-0 mt-0.5" />
                <p className="text-xs text-[#0098EA]/90 leading-relaxed font-medium">
                  Your payment is held in escrow. Released to seller only after you confirm delivery.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Fixed Bottom CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 pt-4 pb-6">
          <Button 
            className="w-full h-14 bg-[#0098EA] hover:bg-[#0098EA]/90 text-white rounded-xl text-base font-semibold shadow-[0_0_20px_rgba(0,152,234,0.3)] hover:shadow-[0_0_25px_rgba(0,152,234,0.4)] transition-all animate-[pulse_2s_infinite]"
          >
            Confirm & Pay 6.64 TON
          </Button>
          <p className="text-center text-[10px] text-zinc-500 mt-3 font-medium">
            By paying you agree to TeleShop Escrow Terms
          </p>
        </div>
      </div>
    </div>
  );
}
