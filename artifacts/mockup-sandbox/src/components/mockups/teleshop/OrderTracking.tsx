import React from "react";
import { ArrowLeft, Check, MapPin, Lock, MessageCircle, AlertCircle, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function OrderTracking() {
  return (
    <div className="bg-neutral-950 text-neutral-50 w-full max-w-[390px] mx-auto min-h-[100dvh] flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-400" />
          </button>
          <div>
            <h1 className="font-medium text-[17px] leading-tight">Order #8821</h1>
          </div>
        </div>
        <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0 rounded-full font-medium px-2.5 py-0.5">
          In Transit
        </Badge>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-6">
          {/* Status Tracker */}
          <section className="bg-neutral-900/50 rounded-2xl p-5 border border-neutral-800/50 text-center">
            <h2 className="text-lg font-semibold mb-6">Your package is on the way</h2>
            
            <div className="relative px-2">
              <div className="absolute top-[11px] left-5 right-5 h-[2px] bg-neutral-800 z-0" />
              <div className="absolute top-[11px] left-5 w-[60%] h-[2px] bg-blue-500 z-0" />
              
              <div className="relative z-10 flex justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-neutral-900/50">
                    <Check className="w-3.5 h-3.5 text-neutral-950" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-neutral-300">Placed</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-neutral-900/50">
                    <Check className="w-3.5 h-3.5 text-neutral-950" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-neutral-300">Confirmed</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-neutral-900/50">
                    <Check className="w-3.5 h-3.5 text-neutral-950" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-neutral-300">Packed</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                    <div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-neutral-900/50 relative z-10" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-blue-400">In Transit</span>
                    <span className="text-[9px] text-blue-400/80 mt-0.5 whitespace-nowrap">Est. Jun 1</span>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center ring-4 ring-neutral-900/50">
                    <div className="w-2 h-2 bg-neutral-600 rounded-full" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-neutral-500">Delivered</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-left">
              <div>
                <p className="text-xs text-neutral-500">Carrier</p>
                <p className="text-sm font-medium text-neutral-300">Viettel Post — VN8821234567</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-2">
                Track
                <ExternalLink className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </section>

          {/* Live Map Placeholder */}
          <div className="bg-neutral-900/40 border border-neutral-800 border-dashed rounded-xl p-4 flex items-start gap-3">
            <div className="mt-0.5 p-2 bg-neutral-800/50 rounded-lg shrink-0">
              <MapPin className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-300">Live location unavailable</p>
              <p className="text-xs text-neutral-500 mt-1">Carrier doesn't support real-time tracking.</p>
              <p className="text-[11px] font-medium text-neutral-400 mt-3 bg-neutral-800/50 inline-block px-2 py-1 rounded">
                Last known: Ho Chi Minh City sorting hub — May 30, 21:00
              </p>
            </div>
          </div>

          {/* Order Details */}
          <Card className="bg-neutral-900 border-neutral-800 rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-neutral-800 rounded-md shrink-0 border border-neutral-700/50" />
                  <div className="flex-1 min-w-0 flex justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-200 truncate">iPhone 15 Pro Case (Carbon)</p>
                      <p className="text-xs text-neutral-500 mt-0.5">x1</p>
                    </div>
                    <p className="text-sm font-medium text-neutral-300 whitespace-nowrap">2.5 TON</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-neutral-800 rounded-md shrink-0 border border-neutral-700/50" />
                  <div className="flex-1 min-w-0 flex justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-200 truncate">USB-C Hub 7-in-1</p>
                      <p className="text-xs text-neutral-500 mt-0.5">x1</p>
                    </div>
                    <p className="text-sm font-medium text-neutral-300 whitespace-nowrap">8 USDT</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/50 p-4 border-t border-neutral-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-neutral-300">2.5 TON + 8 USDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="pt-2 mt-2 border-t border-neutral-800/50 flex justify-between text-sm">
                  <span className="text-neutral-500">Paid via</span>
                  <span className="text-neutral-300 font-mono text-xs">TON Connect (tx: 0xAb...9f)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <div className="flex items-center justify-between bg-neutral-900 p-3 pl-4 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xs font-medium">PZ</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-neutral-200">PhoneZone VN</span>
            </div>
            <Button variant="secondary" size="sm" className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-0 h-8">
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Chat
            </Button>
          </div>

          {/* Escrow Status */}
          <div className="bg-neutral-800/40 rounded-xl p-4 border border-neutral-700/50 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-neutral-700/50 rounded-full shrink-0">
                <Lock className="w-4 h-4 text-neutral-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-200">10.5 USDT equivalent locked in escrow</p>
                <p className="text-xs text-neutral-400 mt-1">Automatically released to seller in 4 days if not confirmed</p>
              </div>
            </div>
            
            <div className="space-y-2.5 mt-5">
              <Button className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-5 border-0">
                Confirm Received — Release Payment
              </Button>
              <Button variant="outline" className="w-full border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300 py-5">
                <AlertCircle className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="flex items-center justify-between p-1">
            <span className="text-sm text-neutral-400">Get Telegram updates for this order</span>
            <Switch defaultChecked className="data-[state=checked]:bg-blue-500" />
          </div>

          <Separator className="bg-neutral-800/50 my-2" />

          {/* Timeline Feed */}
          <div className="space-y-4 pb-8">
            <h3 className="text-sm font-medium text-neutral-400 mb-2 px-1">Updates</h3>
            
            <div className="space-y-5 px-1 relative before:absolute before:inset-y-0 before:left-14 before:w-[2px] before:bg-neutral-800">
              <div className="flex gap-5 relative">
                <div className="text-xs text-neutral-500 w-10 text-right shrink-0 pt-0.5">21:00</div>
                <div className="absolute left-[51px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-neutral-950 z-10" />
                <div className="pl-2">
                  <p className="text-sm text-neutral-200">Arrived at HCMC sorting hub</p>
                  <p className="text-xs text-neutral-500 mt-0.5">May 30</p>
                </div>
              </div>
              
              <div className="flex gap-5 relative">
                <div className="text-xs text-neutral-500 w-10 text-right shrink-0 pt-0.5">08:45</div>
                <div className="absolute left-[51px] top-1.5 w-2 h-2 rounded-full bg-neutral-700 ring-4 ring-neutral-950 z-10" />
                <div className="pl-2">
                  <p className="text-sm text-neutral-300">Handed to Viettel Post courier</p>
                  <p className="text-xs text-neutral-500 mt-0.5">May 30</p>
                </div>
              </div>

              <div className="flex gap-5 relative">
                <div className="text-xs text-neutral-500 w-10 text-right shrink-0 pt-0.5">10:22</div>
                <div className="absolute left-[51px] top-1.5 w-2 h-2 rounded-full bg-neutral-700 ring-4 ring-neutral-950 z-10" />
                <div className="pl-2">
                  <p className="text-sm text-neutral-300">Seller confirmed and started packing</p>
                  <p className="text-xs text-neutral-500 mt-0.5">May 29</p>
                </div>
              </div>

              <div className="flex gap-5 relative">
                <div className="text-xs text-neutral-500 w-10 text-right shrink-0 pt-0.5">10:14</div>
                <div className="absolute left-[51px] top-1.5 w-2 h-2 rounded-full bg-neutral-700 ring-4 ring-neutral-950 z-10" />
                <div className="pl-2">
                  <p className="text-sm text-neutral-300">Order placed and payment received</p>
                  <p className="text-xs text-neutral-500 mt-0.5">May 29</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}

export default OrderTracking;
