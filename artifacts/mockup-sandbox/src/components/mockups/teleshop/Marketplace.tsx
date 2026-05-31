
import { Search, ShoppingBag, Home, User, Wallet, Star, ChevronRight, Clock, ShieldCheck } from "lucide-react";

export function Marketplace() {
  return (
    <div className="mx-auto w-[390px] h-[844px] bg-[#0A0A0A] text-slate-200 relative overflow-hidden font-sans shadow-2xl rounded-3xl border border-slate-800 flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md z-20 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0098EA] to-[#0074C2] flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">TeleShop</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/50">
            <Wallet className="w-3.5 h-3.5 text-[#0098EA]" />
            <span className="text-xs font-medium text-white">12.5 TON</span>
          </div>
          <div className="relative">
            <ShoppingBag className="w-6 h-6 text-slate-300" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white border-2 border-[#0A0A0A]">
              3
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* Flash Sale */}
        <section className="pt-4 pb-2">
          <div className="px-4 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Flash Sale</h2>
              <div className="flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded text-red-400 border border-red-500/20">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold font-mono">02:14:35</span>
              </div>
            </div>
            <button className="text-[11px] text-[#0098EA] font-medium flex items-center">
              See all <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          
          <div className="flex overflow-x-auto px-4 gap-3 pb-2 snap-x">
            {/* Flash Sale Item 1 */}
            <div className="min-w-[140px] bg-[#141414] rounded-xl overflow-hidden border border-slate-800 snap-start">
              <div className="h-[140px] bg-gradient-to-br from-slate-700 to-slate-800 relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -50%
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="text-xs font-medium text-slate-300 line-clamp-1">Uniqlo T-Shirt</h3>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-[#0098EA]">60 USDT</span>
                  <span className="text-[10px] text-slate-500 line-through">120 USDT</span>
                </div>
              </div>
            </div>
            {/* Flash Sale Item 2 */}
            <div className="min-w-[140px] bg-[#141414] rounded-xl overflow-hidden border border-slate-800 snap-start">
              <div className="h-[140px] bg-gradient-to-br from-indigo-900 to-slate-800 relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -37%
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="text-xs font-medium text-slate-300 line-clamp-1">Sony Headphones</h3>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-[#0098EA]">50 TON</span>
                  <span className="text-[10px] text-slate-500 line-through">80 TON</span>
                </div>
              </div>
            </div>
            {/* Flash Sale Item 3 */}
            <div className="min-w-[140px] bg-[#141414] rounded-xl overflow-hidden border border-slate-800 snap-start">
              <div className="h-[140px] bg-gradient-to-br from-emerald-900 to-slate-800 relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -20%
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="text-xs font-medium text-slate-300 line-clamp-1">Mechanical Keyb</h3>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-[#0098EA]">40 TON</span>
                  <span className="text-[10px] text-slate-500 line-through">50 TON</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-2">
          <div className="flex overflow-x-auto px-4 gap-2 pb-2 scrollbar-hide">
            {["All", "Fashion", "Electronics", "Digital", "Gaming", "Food"].map((cat, i) => (
              <button 
                key={cat}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  i === 0 
                    ? "bg-[#0098EA] text-white" 
                    : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Shops */}
        <section className="py-3 border-y border-slate-800/50 my-2 bg-[#141414]/30">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Featured Shops</h2>
          </div>
          <div className="flex overflow-x-auto px-4 gap-4 pb-1 scrollbar-hide snap-x">
            {[
              { name: "PhoneZone VN", color: "from-blue-600 to-indigo-600" },
              { name: "FashionHub", color: "from-pink-600 to-rose-600" },
              { name: "GameItems", color: "from-purple-600 to-fuchsia-600" },
              { name: "DigitalStore", color: "from-cyan-600 to-teal-600" }
            ].map((shop, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 min-w-[72px] snap-start">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${shop.color} p-0.5`}>
                    <div className="w-full h-full rounded-full bg-[#141414] border border-slate-800 flex items-center justify-center text-xs font-bold text-white/50">
                      {shop.name.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#0098EA] text-white rounded-full p-0.5 border-2 border-[#0A0A0A]">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-300 font-medium text-center leading-tight w-full truncate">
                  {shop.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* All Products */}
        <section className="px-4 py-3">
          <h2 className="text-sm font-bold text-white mb-3">Just For You</h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Product 1 */}
            <div className="bg-[#141414] rounded-xl overflow-hidden border border-slate-800 flex flex-col group">
              <div className="aspect-square bg-gradient-to-tr from-stone-800 to-slate-700 relative">
                {/* Image Placeholder */}
              </div>
              <div className="p-2.5 flex-1 flex flex-col">
                <h3 className="text-xs text-slate-200 line-clamp-2 leading-snug flex-1 group-hover:text-[#0098EA] transition-colors">
                  Premium Leather iPhone 15 Pro Max Case
                </h3>
                <div className="mt-2 text-sm font-bold text-[#0098EA]">5.2 TON</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate pr-1">PhoneZone VN</span>
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-[#141414] rounded-xl overflow-hidden border border-slate-800 flex flex-col group">
              <div className="aspect-square bg-gradient-to-tr from-blue-900 to-slate-800 relative"></div>
              <div className="p-2.5 flex-1 flex flex-col">
                <h3 className="text-xs text-slate-200 line-clamp-2 leading-snug flex-1 group-hover:text-[#0098EA] transition-colors">
                  Steam Wallet Gift Card $50 Global
                </h3>
                <div className="mt-2 text-sm font-bold text-[#0098EA]">48 USDT</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate pr-1">GameItems</span>
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span>5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-[#141414] rounded-xl overflow-hidden border border-slate-800 flex flex-col group">
              <div className="aspect-square bg-gradient-to-tr from-purple-900 to-slate-800 relative"></div>
              <div className="p-2.5 flex-1 flex flex-col">
                <h3 className="text-xs text-slate-200 line-clamp-2 leading-snug flex-1 group-hover:text-[#0098EA] transition-colors">
                  Cyberpunk Style Streetwear Jacket
                </h3>
                <div className="mt-2 text-sm font-bold text-[#0098EA]">25 TON</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate pr-1">FashionHub</span>
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span>4.7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-[#141414] rounded-xl overflow-hidden border border-slate-800 flex flex-col group">
              <div className="aspect-square bg-gradient-to-tr from-cyan-900 to-slate-800 relative"></div>
              <div className="p-2.5 flex-1 flex flex-col">
                <h3 className="text-xs text-slate-200 line-clamp-2 leading-snug flex-1 group-hover:text-[#0098EA] transition-colors">
                  Telegram Premium 1 Year Subscription
                </h3>
                <div className="mt-2 text-sm font-bold text-[#0098EA]">28 USDT</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate pr-1">DigitalStore</span>
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product 5 */}
            <div className="bg-[#141414] rounded-xl overflow-hidden border border-slate-800 flex flex-col group">
              <div className="aspect-square bg-gradient-to-tr from-orange-900 to-slate-800 relative"></div>
              <div className="p-2.5 flex-1 flex flex-col">
                <h3 className="text-xs text-slate-200 line-clamp-2 leading-snug flex-1 group-hover:text-[#0098EA] transition-colors">
                  Ergonomic Gaming Mouse Wireless
                </h3>
                <div className="mt-2 text-sm font-bold text-[#0098EA]">15 TON</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate pr-1">GameItems</span>
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span>4.6</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product 6 */}
            <div className="bg-[#141414] rounded-xl overflow-hidden border border-slate-800 flex flex-col group">
              <div className="aspect-square bg-gradient-to-tr from-fuchsia-900 to-slate-800 relative"></div>
              <div className="p-2.5 flex-1 flex flex-col">
                <h3 className="text-xs text-slate-200 line-clamp-2 leading-snug flex-1 group-hover:text-[#0098EA] transition-colors">
                  Oversized Graphic T-Shirt Vintage
                </h3>
                <div className="mt-2 text-sm font-bold text-[#0098EA]">18 USDT</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate pr-1">FashionHub</span>
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 inset-x-0 h-[84px] bg-[#141414]/95 backdrop-blur-xl border-t border-slate-800 flex items-start justify-around pt-3 pb-8 px-2 z-30">
        <button className="flex flex-col items-center gap-1.5 text-[#0098EA]">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-medium">Search</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors relative">
          <Clock className="w-6 h-6" />
          <span className="text-[10px] font-medium">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">My Shop</span>
        </button>
      </nav>
      
      {/* Global styles injected locally just for this mockup to hide scrollbar if index.css is untouched */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
