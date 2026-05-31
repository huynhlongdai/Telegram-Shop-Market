
import {
  Settings,
  ArrowUpRight,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertOctagon,
  Plus,
  Percent,
  Gift,
  Zap,
  Wallet,
  Home,
  ShoppingBag,
  BarChart,
  User,
  ChevronRight,
  MessageSquare,
  Check,
} from "lucide-react";

export function MerchantDashboard() {
  return (
    <div className="w-[390px] mx-auto min-h-screen bg-zinc-950 text-zinc-50 font-sans overflow-x-hidden pb-24 relative shadow-2xl border-x border-zinc-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10 border-b border-zinc-900">
        <div>
          <h1 className="text-lg font-bold tracking-tight">My Shop</h1>
          <p className="text-xs text-zinc-400 font-medium">PhoneZone VN</p>
        </div>
        <button className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors">
          <Settings size={18} className="text-zinc-300" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Status & Plan */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 text-xs font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            Active
          </div>
          <div className="px-2.5 py-1 bg-zinc-900 text-zinc-300 rounded-full border border-zinc-800 text-xs font-medium flex items-center gap-1.5">
            Plan: <span className="text-purple-400 font-semibold">Growth</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <h2 className="text-sm font-medium text-zinc-400">Revenue (This Month)</h2>
            <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} />
              +23%
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-bold tracking-tight text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]">
              847.5 <span className="text-base text-green-500/70 font-semibold">USDT</span>
            </div>
            <div className="text-xl font-bold tracking-tight text-[#0098EA] drop-shadow-[0_0_10px_rgba(0,152,234,0.2)] mt-0.5">
              + 124.3 <span className="text-sm text-[#0098EA]/70 font-semibold">TON</span>
            </div>
          </div>
          
          {/* Faux Sparkline */}
          <div className="mt-4 flex items-end gap-1.5 h-12 w-full">
            {[40, 25, 60, 45, 80, 55, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-zinc-800 rounded-t-sm relative group overflow-hidden" style={{ height: '100%' }}>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-green-500/80 rounded-t-sm transition-all"
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Package size={14} />
              <span className="text-xs font-medium">Total Orders</span>
            </div>
            <div className="text-xl font-bold">1,247</div>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Clock size={14} />
              <span className="text-xs font-medium">Pending</span>
            </div>
            <div className="text-xl font-bold text-yellow-500">8</div>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <CheckCircle size={14} />
              <span className="text-xs font-medium">Completed</span>
            </div>
            <div className="text-xl font-bold">1,190</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertOctagon size={14} />
              <span className="text-xs font-medium">Disputes</span>
            </div>
            <div className="text-xl font-bold text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">2</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Plus, label: "Add Product", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
            { icon: Percent, label: "Create Sale", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
            { icon: Gift, label: "Send Voucher", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
            { icon: Zap, label: "Boost", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <div className={`p-2 rounded-full border ${action.color}`}>
                <action.icon size={16} />
              </div>
              <span className="text-[10px] font-medium text-center leading-tight text-zinc-300">{action.label}</span>
            </button>
          ))}
        </div>

        {/* New Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-zinc-100">Action Required</h3>
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">8 New</span>
            </div>
            <button className="text-xs text-zinc-400 flex items-center hover:text-zinc-200">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { user: "@buyer_nguyen", item: "iPhone 15 Pro Max Silicon Case - Midnight", amount: "12.5 USDT", status: "Pending", img: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=100&h=100&fit=crop" },
              { user: "@tran_minh", item: "Anker 735 Charger (GaNPrime 65W)", amount: "4.2 TON", status: "Pending", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop" },
              { user: "@le_shop", item: "AirPods Pro 2nd Gen Protective Cover", amount: "8.0 USDT", status: "Shipped", img: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&h=100&fit=crop" }
            ].map((order, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                      {order.user.charAt(1).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-zinc-200">{order.user}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    order.status === 'Pending' 
                      ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex gap-3 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                  <img src={order.img} alt="Product" className="w-12 h-12 rounded bg-zinc-800 object-cover" />
                  <div className="flex-1">
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-tight mb-1">{order.item}</p>
                    <p className="text-sm font-bold font-mono text-zinc-100">{order.amount}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                    <MessageSquare size={14} /> Chat
                  </button>
                  {order.status === 'Pending' && (
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-zinc-950 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <Check size={14} /> Confirm
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Mini */}
        <div>
          <h3 className="font-semibold text-zinc-100 mb-3 text-sm">Top Products (30d)</h3>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            {[
              { name: "iPhone 15 Clear Case", sales: 145, rev: "1,240 USDT" },
              { name: "20W USB-C Adapter", sales: 98, rev: "890 USDT" },
              { name: "Screen Protector 3-Pack", sales: 84, rev: "420 USDT" }
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-zinc-800/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-zinc-500 w-4">{i + 1}</div>
                  <div>
                    <p className="text-xs font-medium text-zinc-200">{p.name}</p>
                    <p className="text-[10px] text-zinc-500">{p.sales} sales</p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-green-400">{p.rev}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet */}
        <div>
          <h3 className="font-semibold text-zinc-100 mb-3 text-sm">Merchant Wallet</h3>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-zinc-400 mb-1">Available to Withdraw</p>
                <div className="text-2xl font-bold text-white tracking-tight">234.5 <span className="text-sm text-zinc-500">USDT</span></div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 mb-1">Pending Escrow</p>
                <div className="text-sm font-medium text-yellow-500">89.0 <span className="text-[10px]">USDT</span></div>
              </div>
            </div>
            <button className="w-full bg-zinc-100 text-zinc-900 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors">
              <Wallet size={16} /> Withdraw Funds
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-[390px] bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 pb-safe z-50">
        <div className="flex items-center justify-around p-3">
          <button className="flex flex-col items-center gap-1 text-zinc-500">
            <Home size={20} />
            <span className="text-[9px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500">
            <ShoppingBag size={20} />
            <span className="text-[9px] font-medium">Products</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-100">
            <div className="relative">
              <BarChart size={20} />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-zinc-900"></div>
            </div>
            <span className="text-[9px] font-medium">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500">
            <User size={20} />
            <span className="text-[9px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MerchantDashboard;