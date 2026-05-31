import { useState } from "react";
import { ChevronLeft, Star, Plus, Minus, ShieldCheck, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Black");

  const colors = [
    { name: "Black", hex: "#1c1c1c" },
    { name: "Blue", hex: "#1e3a8a" },
    { name: "Red", hex: "#991b1b" },
  ];

  return (
    <div className="w-[390px] h-[844px] bg-[#0f0f0f] text-zinc-100 overflow-y-auto font-sans relative shadow-2xl mx-auto rounded-3xl border border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0f0f0f]/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-zinc-800">
        <button className="text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Store</span>
          <span className="text-sm font-medium">PhoneZone VN</span>
        </div>
      </div>

      <div className="flex-1 pb-24">
        {/* Product Image Area */}
        <div className="h-[280px] w-full bg-gradient-to-b from-zinc-800 to-zinc-900 relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-400 via-transparent to-transparent" />
          <div className="w-48 h-56 bg-zinc-800 rounded-2xl border border-zinc-700 shadow-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80')] bg-cover bg-center opacity-80" />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-bold leading-tight text-white">iPhone 15 Pro Max Case — Carbon Fiber</h1>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-white tracking-tight">2.5 TON</span>
              <span className="text-sm text-zinc-500 mb-1 font-medium">≈ $7.25 USD</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-current mr-1" />
              <span className="font-semibold">4.9</span>
            </div>
            <span className="text-zinc-400">(127 reviews)</span>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Variants */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-300">Color</span>
              <span className="text-xs text-zinc-500">In stock: 48 units</span>
            </div>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                    selectedColor === color.name
                      ? "border-[#0098EA] bg-[#0098EA]/10"
                      : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full shadow-inner border border-white/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={`text-sm font-medium ${selectedColor === color.name ? "text-[#0098EA]" : "text-zinc-400"}`}>
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-300">Description</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Ultra-thin carbon fiber case providing military-grade drop protection without the bulk. Features raised lips for camera and screen protection.
              <button className="text-[#0098EA] hover:underline ml-1 font-medium">Read more</button>
            </p>
          </div>

          {/* Shop Info */}
          <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between border border-zinc-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-zinc-700">
                <AvatarImage src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&q=80" />
                <AvatarFallback className="bg-zinc-800 text-xs">PZ</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">PhoneZone VN</span>
                <span className="text-xs text-zinc-500">Verified Seller</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full border-zinc-700 text-xs h-8 bg-transparent text-white hover:bg-zinc-800 hover:text-white">
              Visit Shop <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Checkout Section */}
          <div className="space-y-5 bg-zinc-900/50 -mx-5 px-5 py-6 border-y border-zinc-800">
            <h2 className="text-lg font-bold text-white">Checkout</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Quantity</span>
                <div className="flex items-center gap-3 bg-zinc-900 rounded-full border border-zinc-800 p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-4 text-center text-sm font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Shipping</span>
                <span className="text-sm font-medium text-white">Discuss with seller</span>
              </div>

              <div className="pt-2">
                <Input 
                  placeholder="Enter voucher code" 
                  className="bg-zinc-900 border-zinc-800 focus-visible:ring-[#0098EA] placeholder:text-zinc-600 h-11"
                />
              </div>

              <div className="pt-2 border-t border-zinc-800/50 flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-300">Order Total</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{2.5 * quantity} TON</div>
                  <div className="text-xs text-zinc-500">+ gas (~0.01 TON)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Preview */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white">Recent Reviews</h3>
              <button className="text-xs text-[#0098EA] hover:underline">See all 127</button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold">A</div>
                    <span className="text-xs font-medium text-zinc-300">Alex M.</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-snug">Perfect fit. The carbon texture feels premium and adds great grip to the phone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800 p-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs font-medium text-zinc-300">Wallet connected: <span className="font-mono text-zinc-400">UQAb...x7Kp</span></span>
          </div>
        </div>
        
        <Button 
          className="w-full h-14 bg-[#0098EA] hover:bg-[#008ce6] text-white font-bold text-lg rounded-2xl shadow-[0_0_24px_rgba(0,152,234,0.4)] hover:shadow-[0_0_32px_rgba(0,152,234,0.6)] transition-all border border-white/10"
        >
          Pay with TON Connect
        </Button>
        
        <div className="mt-3 flex items-center justify-center gap-1.5 text-zinc-500">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">Funds held in escrow until delivery confirmed</span>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
