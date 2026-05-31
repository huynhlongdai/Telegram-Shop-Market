import React, { useState } from 'react';
import { ArrowLeft, Calendar, Bell, Sparkles, X, ChevronRight, Zap, Info } from 'lucide-react';

export function FlashSaleSetup() {
  const [notifyFollowers, setNotifyFollowers] = useState(true);
  const [featureMarketplace, setFeatureMarketplace] = useState(true);

  return (
    <div className="min-h-[100dvh] bg-[#0f0f13] text-slate-50 w-full max-w-[390px] mx-auto overflow-y-auto font-sans pb-24 shadow-2xl relative flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0f0f13]/80 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight">Create Flash Sale</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Preview</span>
          <button className="w-9 h-5 bg-slate-800 rounded-full relative transition-colors border border-white/10">
            <div className="w-4 h-4 bg-slate-400 rounded-full absolute left-0.5 top-0.5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-5">
        {/* Sale Config Card */}
        <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block uppercase tracking-wider">Sale Name</label>
            <input 
              type="text" 
              value="Summer Clear-Out Sale"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block uppercase tracking-wider">Start Time</label>
              <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm">Jun 01, 10:00 AM</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block uppercase tracking-wider">End Time</label>
              <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm">Jun 01, 02:00 PM</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 flex items-center justify-end gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-500" /> Duration: 4 hours
          </p>

          <div className="h-px bg-white/5 my-2" />

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Notify followers</p>
                <p className="text-xs text-slate-400">Send push notification to 3,241 users</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifyFollowers(!notifyFollowers)}
              className={`w-11 h-6 rounded-full relative transition-colors ${notifyFollowers ? 'bg-blue-500' : 'bg-slate-800'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notifyFollowers ? 'left-5.5' : 'left-0.5'}`} style={{ transform: notifyFollowers ? 'translateX(22px)' : 'translateX(2px)' }} />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Feature on Marketplace</p>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-medium border border-purple-500/30">5 USDT/day</span>
                </div>
                <p className="text-xs text-slate-400">Boost visibility during sale</p>
              </div>
            </div>
            <button 
              onClick={() => setFeatureMarketplace(!featureMarketplace)}
              className={`w-11 h-6 rounded-full relative transition-colors ${featureMarketplace ? 'bg-blue-500' : 'bg-slate-800'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${featureMarketplace ? 'left-5.5' : 'left-0.5'}`} style={{ transform: featureMarketplace ? 'translateX(22px)' : 'translateX(2px)' }} />
            </button>
          </div>
        </section>

        {/* Estimated Reach Card */}
        <section className="rounded-2xl p-4 bg-gradient-to-br from-teal-950/80 to-slate-900 border border-teal-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full" />
          <h3 className="text-sm font-semibold text-teal-100 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-400" /> Estimated Impact
          </h3>
          <div className="space-y-2.5 relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-teal-100/70">Your followers</span>
              <span className="font-medium text-white">3,241</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-teal-100/70">Marketplace impression</span>
              <span className="font-medium text-white">~12,000</span>
            </div>
            <div className="h-px bg-teal-900/50 my-1" />
            <div className="flex justify-between items-center">
              <span className="text-teal-100/70 text-sm font-medium">Expected orders</span>
              <span className="font-bold text-teal-300 text-base">45–90</span>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">3 products selected</h3>
            <button className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2.5 py-1 rounded-lg hover:bg-blue-500/20 transition-colors">
              + Add Products
            </button>
          </div>

          <div className="space-y-3">
            {/* Product 1 */}
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3 relative group">
              <button className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <X className="w-3 h-3" />
              </button>
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-indigo-900/50 border border-indigo-500/20 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate pr-4">iPhone 15 Pro Case</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 line-through">4.2 TON</span>
                    <span className="text-sm font-semibold text-white">2.5 TON</span>
                    <span className="text-[10px] font-bold bg-[#ff453a]/20 text-[#ff453a] px-1.5 py-0.5 rounded">-40%</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <label className="text-[11px] text-slate-400">Sale limit:</label>
                    <input type="text" value="20 units" readOnly className="bg-black/40 border border-white/10 rounded flex-1 px-2 py-1 text-xs text-slate-300 text-right focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3 relative group">
              <button className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <X className="w-3 h-3" />
              </button>
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-emerald-900/50 border border-emerald-500/20 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate pr-4">USB-C Hub 7-in-1</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 line-through">8 USDT</span>
                    <span className="text-sm font-semibold text-white">6 USDT</span>
                    <span className="text-[10px] font-bold bg-[#ff453a]/20 text-[#ff453a] px-1.5 py-0.5 rounded">-25%</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <label className="text-[11px] text-slate-400">Sale limit:</label>
                    <input type="text" value="15 units" readOnly className="bg-black/40 border border-white/10 rounded flex-1 px-2 py-1 text-xs text-slate-300 text-right focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3 relative group">
              <button className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <X className="w-3 h-3" />
              </button>
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-rose-900/50 border border-rose-500/20 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate pr-4">Screen Protector x3</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 line-through">1.5 TON</span>
                    <span className="text-sm font-semibold text-white">1.0 TON</span>
                    <span className="text-[10px] font-bold bg-[#ff453a]/20 text-[#ff453a] px-1.5 py-0.5 rounded">-33%</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <label className="text-[11px] text-slate-400">Sale limit:</label>
                    <input type="text" value="50 units" readOnly className="bg-black/40 border border-white/10 rounded flex-1 px-2 py-1 text-xs text-slate-300 text-right focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Announcement Preview */}
        <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Info className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Tap to preview notification</p>
              <p className="text-xs text-slate-500">See what followers will receive</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </section>
      </main>

      {/* Footer / Cost Summary */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-[#0f0f13] border-t border-white/10 p-4 pb-8 space-y-3 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-slate-400">Marketplace feature</span>
          <span className="text-slate-300">5 USDT (1 day)</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium mb-3">
          <span className="text-white">Total cost to launch</span>
          <span className="text-blue-400 font-bold">5 USDT</span>
        </div>
        
        <button className="w-full bg-[#0098EA] hover:bg-[#0088D1] active:bg-[#0077B8] text-white font-semibold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(0,152,234,0.3)] transition-all flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Pay 5 USDT & Launch Sale
        </button>
        <button className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-slate-300 font-medium py-3 px-4 rounded-xl transition-all text-sm">
          Schedule for Free — Not Featured
        </button>
      </footer>
    </div>
  );
}

export default FlashSaleSetup;