import { useState } from "react";
import { 
  BadgeCheck, 
  MessageCircle, 
  Star, 
  ChevronRight, 
  Search, 
  ShoppingCart, 
  Percent,
  Plus
} from "lucide-react";

export function ShopPage() {
  const [activeTab, setActiveTab] = useState("Products");
  const [activeFilter, setActiveFilter] = useState("All");

  const products = [
    {
      id: 1,
      name: "Ốp lưng iPhone 15 Pro Max chống sốc",
      price: "2.5 TON",
      originalPrice: "3.5 TON",
      imageColor: "bg-slate-800",
      inStock: true,
      sale: true,
      sold: 124,
    },
    {
      id: 2,
      name: "Vỏ bảo vệ AirPods Pro Silicon mềm",
      price: "4 TON",
      imageColor: "bg-zinc-800",
      inStock: true,
      sale: false,
      sold: 89,
    },
    {
      id: 3,
      name: "Hub chuyển đổi USB-C 7 trong 1",
      price: "8 USDT",
      originalPrice: "10 USDT",
      imageColor: "bg-stone-800",
      inStock: true,
      sale: true,
      sold: 342,
    },
    {
      id: 4,
      name: "Kính cường lực chống nhìn trộm",
      price: "1.2 TON",
      originalPrice: "2 TON",
      imageColor: "bg-neutral-800",
      inStock: true,
      sale: true,
      sold: 856,
    }
  ];

  const tabs = ["Products", "Sale", "Vouchers", "Reviews"];
  const filters = ["All", "In Stock", "Sale"];

  return (
    <div className="w-[390px] h-[844px] bg-[#0f0f13] text-white flex flex-col font-sans overflow-hidden border border-zinc-800 mx-auto rounded-3xl shadow-2xl relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-[80px] scrollbar-hide">
        
        {/* Header / Banner */}
        <div className="relative h-40 w-full bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            {/* Nav actions could go here */}
          </div>
        </div>

        {/* Shop Info Container */}
        <div className="px-4 pb-4 relative -mt-12">
          <div className="bg-[#1c1c1e] rounded-2xl p-4 shadow-xl border border-white/5 backdrop-blur-md">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-[#1c1c1e] rounded-[10px] flex items-center justify-center font-bold text-2xl text-blue-500">
                    PZ
                  </div>
                </div>
                <div className="pt-10">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-xl font-bold tracking-tight">PhoneZone VN</h1>
                    <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                    <div className="flex items-center gap-1 text-yellow-500 font-medium">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" />
                      4.8
                    </div>
                    <span>•</span>
                    <span>1,234 orders</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Follow
              </button>
              <button className="flex-1 bg-white/10 hover:bg-white/15 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/5">
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-white/5">
          <div className="text-center">
            <div className="text-lg font-bold">847</div>
            <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Products</div>
          </div>
          <div className="text-center border-l border-r border-white/5">
            <div className="text-lg font-bold">3.2K</div>
            <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">98%</div>
            <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Response</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide px-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-blue-500 text-blue-500" 
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content - Products */}
        {activeTab === "Products" && (
          <div className="p-4">
            {/* Vouchers Hint */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-3 mb-5 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-orange-400">2 active vouchers</div>
                  <div className="text-xs text-zinc-400">Tap to claim before checkout</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-500" />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${
                    activeFilter === filter
                      ? "bg-blue-600/10 border-blue-500/50 text-blue-400"
                      : "bg-[#1c1c1e] border-white/5 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3">
              {products.map(product => (
                <div key={product.id} className="bg-[#1c1c1e] border border-white/5 rounded-2xl overflow-hidden group">
                  <div className={`aspect-square w-full ${product.imageColor} relative`}>
                    {/* Placeholder image representation */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.sale && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                          SALE
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-sm font-medium leading-tight text-zinc-200 line-clamp-2 mb-2 min-h-[40px]">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        {product.originalPrice && (
                          <div className="text-[10px] text-zinc-500 line-through">
                            {product.originalPrice}
                          </div>
                        )}
                        <div className="text-sm font-bold text-blue-400">
                          {product.price}
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium">
                        {product.sold} sold
                      </div>
                    </div>
                    
                    <button className="w-full bg-white/5 hover:bg-blue-600 hover:text-white text-blue-500 font-medium text-xs py-2 rounded-lg transition-colors flex justify-center items-center gap-1.5">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0f0f13]/90 backdrop-blur-xl border-t border-white/5 z-10">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search in shop..."
            className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
          />
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
