import React from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Circle, 
  Lock, 
  MessageSquare, 
  Plus, 
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DisputeFlow() {
  return (
    <div className="flex justify-center bg-black min-h-screen font-sans text-slate-200">
      <div className="w-full max-w-[390px] bg-[#111113] min-h-screen relative overflow-hidden flex flex-col shadow-2xl border-x border-white/5">
        
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#111113]/80 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-1 -ml-1 text-slate-400 hover:text-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-medium text-slate-100">Dispute #4821</h1>
          </div>
          <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-normal shadow-none hover:bg-amber-500/20 transition-colors">
            Under Review
          </Badge>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-24">
          <div className="p-4 space-y-6">
            
            {/* Escrow Status Card */}
            <Card className="bg-[#1C1C1F] border-amber-500/10 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-amber-500/10 mt-0.5">
                    <Lock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-amber-500/90 text-sm">5.0 TON locked in escrow</h3>
                    <p className="text-xs text-slate-400">Funds will be released based on admin decision.</p>
                    <div className="pt-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500/60" />
                      <span className="text-xs font-mono text-amber-500/80">Admin decision in: 22:14:08</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Info Card */}
            <section className="space-y-3">
              <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider pl-1">Order Details</h2>
              <Card className="bg-[#161618] border-white/5 shadow-none">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-slate-200">Order #8821</div>
                      <div className="text-sm text-slate-400 mt-0.5">iPhone 15 Case x2</div>
                    </div>
                    <div className="text-sm font-medium text-slate-200">5.0 TON</div>
                  </div>
                  
                  <Separator className="bg-white/5" />
                  
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Buyer</span>
                      <span className="text-blue-400">@nguyen_van_a</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Seller</span>
                      <span className="text-slate-300">PhoneZone VN</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Order Date</span>
                      <span className="text-slate-300">May 18</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Expected</span>
                      <span className="text-slate-300">May 25</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Timeline Stepper */}
            <section className="space-y-4">
              <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider pl-1">Dispute Timeline</h2>
              <div className="pl-2">
                <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/20 before:via-amber-500/20 before:to-white/5">
                  
                  {/* Step 1: Opened */}
                  <div className="relative">
                    <div className="absolute left-[-28px] bg-[#111113] p-0.5 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-slate-200">Dispute Opened</span>
                        <span className="text-xs text-slate-500">May 28, 14:32</span>
                      </div>
                      <p className="text-xs text-slate-400">Buyer: "Item not received after 10 days"</p>
                    </div>
                  </div>

                  {/* Step 2: Notified */}
                  <div className="relative">
                    <div className="absolute left-[-28px] bg-[#111113] p-0.5 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-slate-200">Seller Notified</span>
                        <span className="text-xs text-slate-500">May 28, 14:33</span>
                      </div>
                      <p className="text-xs text-slate-400 italic">System message</p>
                    </div>
                  </div>

                  {/* Step 3: Active */}
                  <div className="relative">
                    <div className="absolute left-[-28px] bg-[#111113] p-0.5 rounded-full">
                      <div className="relative flex h-5 w-5 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20"></span>
                        <Clock className="w-4 h-4 text-amber-500" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-amber-500/90">Evidence Review</span>
                        <span className="text-xs text-amber-500/60">In progress</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Pending */}
                  <div className="relative">
                    <div className="absolute left-[-26px] bg-[#111113] p-1 rounded-full">
                      <Circle className="w-3 h-3 text-slate-600" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-slate-500">Admin Decision</span>
                        <span className="text-xs text-slate-600">Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 5: Pending */}
                  <div className="relative">
                    <div className="absolute left-[-26px] bg-[#111113] p-1 rounded-full">
                      <Circle className="w-3 h-3 text-slate-600" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-slate-500">Resolved</span>
                        <span className="text-xs text-slate-600">Pending</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Evidence Section */}
            <section className="space-y-4 pt-2">
              <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider pl-1">Evidence Submitted</h2>
              
              <div className="space-y-4">
                {/* Buyer Evidence */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-400">Buyer Evidence</div>
                  <Card className="bg-[#161618] border-white/5 shadow-none">
                    <CardContent className="p-3 space-y-3">
                      <p className="text-xs text-slate-300">
                        "Ordered 10 days ago, tracking hasn't updated since May 20"
                      </p>
                      <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-12 h-12 rounded bg-[#1C1C1F] border border-white/5 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-slate-600" />
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-500">Screenshot of order tracking showing no movement (3 photos)</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Seller Evidence */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-400">Seller Evidence</div>
                  <Card className="bg-[#161618] border-white/5 shadow-none">
                    <CardContent className="p-3 space-y-3">
                      <p className="text-xs text-slate-300">
                        "Package was handed to courier on May 19, tracking may be delayed"
                      </p>
                      <div className="text-xs">
                        <span className="text-slate-500">Shipped via Viettel Post, tracking: </span>
                        <span className="text-blue-400 underline decoration-blue-400/30 underline-offset-2">VN1234567890</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

          </div>
        </main>

        {/* Sticky Actions Footer */}
        <footer className="absolute bottom-0 inset-x-0 p-4 bg-[#111113] border-t border-white/5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full bg-transparent border-white/10 text-slate-300 hover:bg-white/5 hover:text-white h-11 text-xs">
              <Plus className="w-4 h-4 mr-2" />
              Add Evidence
            </Button>
            <Button variant="outline" className="w-full bg-transparent border-white/10 text-slate-300 hover:bg-white/5 hover:text-white h-11 text-xs">
              <MessageSquare className="w-4 h-4 mr-2" />
              Support
            </Button>
          </div>
          
          <Button variant="outline" className="w-full bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-11 text-xs font-medium">
            Accept Seller's Response &mdash; Release Funds
          </Button>

          <div className="flex items-start gap-2 pt-2">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-tight">
              All communications are recorded. False claims may result in account suspension.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
