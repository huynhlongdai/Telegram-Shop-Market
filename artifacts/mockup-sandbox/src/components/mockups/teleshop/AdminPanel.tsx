import React from "react";
import {
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Store,
  ShoppingCart,
  Lock,
  ChevronRight,
  Megaphone,
  Settings,
  Download,
  Ban,
  Activity,
  Zap,
  CreditCard,
  UserPlus,
  RefreshCw,
  Clock,
  Circle,
  BarChart3
} from "lucide-react";

export function AdminPanel() {
  return (
    <div className="w-full max-w-[390px] min-h-[100dvh] bg-zinc-950 text-zinc-200 font-sans mx-auto overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-zinc-100 tracking-tight">
              TeleShop Admin
            </h1>
            <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Admin
            </span>
          </div>
        </div>
        <div className="text-xs text-zinc-500 font-medium">May 31, 2025</div>
      </div>

      <div className="p-4 space-y-6">
        {/* Platform Health Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-2">
              <Store className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Shops Active</span>
            </div>
            <div className="text-xl font-bold text-emerald-400">847</div>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-blue-400 mb-2">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Orders Today</span>
            </div>
            <div className="text-xl font-bold text-blue-400">1,204</div>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-red-400 mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Open Disputes</span>
            </div>
            <div className="text-xl font-bold text-red-400">12</div>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-amber-400 mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Escrow Locked</span>
            </div>
            <div className="text-xl font-bold text-amber-400">4,821 <span className="text-xs font-medium opacity-70">USDT</span></div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-zinc-400" />
              Platform Revenue — May 2025
            </h2>
          </div>
          
          <div className="flex justify-between items-end mb-5">
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-1 tracking-tight">
                4,887 <span className="text-lg text-emerald-500/70">USDT</span>
              </div>
              <div className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18% vs April
              </div>
            </div>
            
            {/* Small 7-bar chart (week view) */}
            <div className="flex items-end gap-1 h-10">
              {[40, 55, 30, 70, 65, 85, 100].map((height, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-t-sm ${i === 6 ? 'bg-emerald-400' : 'bg-zinc-700'}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-zinc-800/80 pt-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Commission collected</span>
              <span className="font-medium text-zinc-200">2,847 USDT</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Ads revenue</span>
              <span className="font-medium text-zinc-200">1,240 USDT</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Clone fees</span>
              <span className="font-medium text-zinc-200">800 USDT</span>
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Pending Actions
            </h2>
            <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
              5 items need review
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="bg-zinc-900 border-l-4 border-l-amber-500 border border-zinc-800 rounded-r-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-100">Shop approval</div>
                <div className="text-xs text-zinc-400 mt-0.5">3 new shops waiting approval</div>
              </div>
              <button className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors px-3 py-1.5 rounded text-xs font-semibold">
                Review
              </button>
            </div>
            
            <div className="bg-zinc-900 border-l-4 border-l-red-500 border border-zinc-800 rounded-r-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-100">Disputes</div>
                <div className="text-xs text-red-400/80 mt-0.5">12 open disputes (2 overdue &gt;48h)</div>
              </div>
              <button className="bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors px-3 py-1.5 rounded text-xs font-semibold">
                Review
              </button>
            </div>
            
            <div className="bg-zinc-900 border-l-4 border-l-blue-500 border border-zinc-800 rounded-r-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-100">Ads queue</div>
                <div className="text-xs text-zinc-400 mt-0.5">4 ad slots pending approval</div>
              </div>
              <button className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors px-3 py-1.5 rounded text-xs font-semibold">
                Review
              </button>
            </div>
          </div>
        </div>

        {/* Top Shops This Month */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-zinc-100">Top Shops This Month</h2>
          </div>
          <div className="divide-y divide-zinc-800/80">
            {/* Rank 1 */}
            <div className="p-3 flex items-center justify-between bg-zinc-800/20">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold border border-amber-500/30">
                  1
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                    PhoneZone VN
                    <span className="bg-amber-500/20 text-amber-500 text-[9px] uppercase px-1.5 py-[1px] rounded font-bold">Top Seller</span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">847 orders</div>
                </div>
              </div>
              <div className="text-sm font-bold text-emerald-400">2,341<span className="text-[10px] text-emerald-500/70 ml-1">USDT</span></div>
            </div>
            {/* Rank 2 */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-100">FashionHub</div>
                  <div className="text-xs text-zinc-400 mt-0.5">612 orders</div>
                </div>
              </div>
              <div className="text-sm font-bold text-emerald-400">1,890<span className="text-[10px] text-emerald-500/70 ml-1">USDT</span></div>
            </div>
            {/* Rank 3 */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-100">GameItems Store</div>
                  <div className="text-xs text-zinc-400 mt-0.5">445 orders</div>
                </div>
              </div>
              <div className="text-sm font-bold text-emerald-400">987<span className="text-[10px] text-emerald-500/70 ml-1">USDT</span></div>
            </div>
          </div>
          <button className="w-full p-3 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center gap-1 border-t border-zinc-800 bg-zinc-900/50">
            View All Shops <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-zinc-400" />
            Recent Activity
          </h2>
          
          <div className="ml-2.5 border-l border-zinc-800 space-y-4 pb-2">
            {/* Event 1 */}
            <div className="relative pl-5">
              <div className="absolute -left-2 top-0.5 bg-zinc-950 p-0.5 rounded-full">
                <UserPlus className="w-3 h-3 text-blue-400" />
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed">
                <span className="font-medium text-zinc-100">New shop registered:</span> DigitalGoods VN
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 2 min ago
              </div>
            </div>
            {/* Event 2 */}
            <div className="relative pl-5">
              <div className="absolute -left-2 top-0.5 bg-zinc-950 p-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3 text-red-500" />
              </div>
              <div className="text-xs text-red-300/80 leading-relaxed">
                <span className="font-medium text-red-400">Dispute #4821 escalated</span> — admin review needed
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 15 min ago
              </div>
            </div>
            {/* Event 3 */}
            <div className="relative pl-5">
              <div className="absolute -left-2 top-0.5 bg-zinc-950 p-0.5 rounded-full">
                <Zap className="w-3 h-3 text-amber-500" />
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed">
                <span className="font-medium text-zinc-100">Flash sale started:</span> FashionHub (-40%)
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 1 hr ago
              </div>
            </div>
            {/* Event 4 */}
            <div className="relative pl-5">
              <div className="absolute -left-2 top-0.5 bg-zinc-950 p-0.5 rounded-full">
                <CreditCard className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed">
                <span className="font-medium text-zinc-100">Payout processed:</span> PhoneZone VN — 234.5 USDT
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 2 hr ago
              </div>
            </div>
            {/* Event 5 */}
            <div className="relative pl-5">
              <div className="absolute -left-2 top-0.5 bg-zinc-950 p-0.5 rounded-full">
                <Megaphone className="w-3 h-3 text-purple-400" />
              </div>
              <div className="text-xs text-zinc-300 leading-relaxed">
                <span className="font-medium text-zinc-100">New ad approved:</span> GameItems banner
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 3 hr ago
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:bg-zinc-800/80 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2">
            <Megaphone className="w-5 h-5 text-zinc-300" />
            <span className="text-xs font-medium text-zinc-300">Send Broadcast</span>
          </button>
          <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:bg-zinc-800/80 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2">
            <Settings className="w-5 h-5 text-zinc-300" />
            <span className="text-xs font-medium text-zinc-300">Config Fees</span>
          </button>
          <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:bg-zinc-800/80 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2">
            <Download className="w-5 h-5 text-zinc-300" />
            <span className="text-xs font-medium text-zinc-300">Export Report</span>
          </button>
          <button className="bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 active:bg-red-500/20 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2 group">
            <Ban className="w-5 h-5 text-red-500 group-hover:text-red-400" />
            <span className="text-xs font-medium text-red-500 group-hover:text-red-400">Ban User</span>
          </button>
        </div>

        {/* System Status */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-3 pt-2">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800/50">
            <span className="text-xs font-medium text-zinc-400">System Status</span>
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Last sync: 30 sec ago
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-500 font-medium uppercase">API</span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" /> Online
              </div>
            </div>
            <div className="flex flex-col gap-1 border-l border-zinc-800/50 pl-2">
              <span className="text-[10px] text-zinc-500 font-medium uppercase">TON Node</span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" /> Online
              </div>
            </div>
            <div className="flex flex-col gap-1 border-l border-zinc-800/50 pl-2">
              <span className="text-[10px] text-zinc-500 font-medium uppercase">Escrow Contract</span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" /> Active
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminPanel;
