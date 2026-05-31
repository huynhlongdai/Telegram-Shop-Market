import React, { useState } from "react";
import { 
  Check, 
  ChevronRight, 
  Camera, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronDown,
  Copy,
  Zap,
  Globe
} from "lucide-react";

export function CreateShop() {
  const [shopName, setShopName] = useState("PhoneZone VN");
  const [description, setDescription] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex justify-center bg-[#0B101E] min-h-screen text-slate-100 font-sans">
      <div className="w-[390px] bg-[#111827] shadow-2xl relative flex flex-col min-h-screen border-x border-[#1F2937]">
        {/* Top Bar - Plan Chip */}
        <div className="px-5 pt-6 pb-2">
          <div className="inline-flex items-center gap-2 bg-[#1F2937] rounded-full px-3 py-1.5 border border-[#374151]">
            <div className="bg-[#6366F1]/20 p-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-[#818CF8]" />
            </div>
            <span className="text-xs font-medium text-slate-300">Growth Plan — 80 USDT/mo</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="px-5 py-4 flex items-center justify-between relative">
          <div className="absolute left-5 right-5 top-1/2 -translate-y-1/2 h-0.5 bg-[#374151] -z-10" />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 h-0.5 bg-[#0098EA] -z-10" style={{ width: '25%' }} />
          
          {[1, 2, 3, 4, 5].map((step) => {
            const isActive = step === 2;
            const isCompleted = step < 2;
            return (
              <div 
                key={step}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                  ${isCompleted ? 'bg-[#0098EA] text-white' : 
                    isActive ? 'bg-[#0098EA] text-white ring-4 ring-[#0098EA]/20' : 
                    'bg-[#1F2937] text-slate-500 border border-[#374151]'}`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-4 flex justify-between text-xs text-slate-400 font-medium">
          <span>Plan</span>
          <span className="text-[#0098EA]">Identity</span>
          <span>Payment</span>
          <span>Products</span>
          <span>Launch</span>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-5 pb-32 overflow-y-auto custom-scrollbar">
          <h1 className="text-2xl font-bold text-white mb-6 tracking-tight">Set up your shop identity</h1>

          <div className="space-y-6">
            {/* Shop Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-[#1F2937] border border-[#374151] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0098EA] focus:border-transparent transition-all shadow-[0_0_15px_rgba(0,152,234,0.1)]"
              />
            </div>

            {/* Slug Preview */}
            <div 
              onClick={handleCopy}
              className="bg-[#0098EA]/10 border border-[#0098EA]/20 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-[#0098EA]/15 transition-colors"
            >
              <div className="overflow-hidden pr-3">
                <span className="text-[11px] text-[#0098EA]/70 block mb-0.5 font-medium uppercase tracking-wider">Your shop link</span>
                <span className="text-sm text-[#38BDF8] font-medium truncate block">t.me/TeleShopBot?shop=phonezonevn</span>
              </div>
              <div className="shrink-0 p-2 bg-[#0098EA]/20 rounded-lg text-[#38BDF8]">
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Category</label>
              <div className="relative">
                <select className="w-full bg-[#1F2937] border border-[#374151] rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#0098EA]/50">
                  <option>Electronics & Gadgets</option>
                  <option>Fashion & Apparel</option>
                  <option>Food & Beverage</option>
                  <option>Services</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you sell..."
                rows={3}
                className="w-full bg-[#1F2937] border border-[#374151] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0098EA]/50 resize-none"
              />
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 border-2 border-dashed border-[#374151] rounded-2xl bg-[#1F2937]/50 hover:bg-[#1F2937] transition-colors flex flex-col items-center justify-center p-6 cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#374151] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5 text-slate-300" />
                </div>
                <span className="text-sm font-medium text-white mb-1">Upload logo</span>
                <span className="text-[10px] text-slate-500 text-center">Max 2MB, PNG/JPG</span>
              </div>
              
              <div className="col-span-1 border-2 border-dashed border-[#374151] rounded-2xl bg-[#1F2937]/50 hover:bg-[#1F2937] transition-colors flex flex-col items-center justify-center p-6 cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#374151] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5 text-slate-300" />
                </div>
                <span className="text-sm font-medium text-white mb-1">Add banner</span>
                <span className="text-[10px] text-slate-500 text-center">Optional</span>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium text-slate-300">Primary Language</label>
              <div className="flex bg-[#1F2937] rounded-xl p-1 border border-[#374151]">
                <button className="flex-1 py-2 text-sm font-medium rounded-lg bg-[#374151] text-white shadow-sm">
                  Vietnamese
                </button>
                <button className="flex-1 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
                  English
                </button>
              </div>
            </div>

            {/* Value Prop Card */}
            <div className="mt-8 bg-gradient-to-b from-[#1F2937] to-[#111827] border border-[#374151] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0098EA]" />
                What you get:
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Your own custom shop link",
                  "Appear in Telegram Marketplace",
                  "Instant order notifications"
                ].map((perk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-[#0098EA] shrink-0 mt-0.5" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#111827]/80 backdrop-blur-xl border-t border-[#374151] p-4 flex gap-3">
          <button className="px-5 py-3.5 rounded-xl border border-[#374151] text-slate-300 font-medium hover:bg-[#1F2937] transition-colors flex items-center justify-center bg-[#1F2937]/50">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="flex-1 bg-[#0098EA] hover:bg-[#007AB8] text-white rounded-xl py-3.5 px-4 font-semibold shadow-[0_4px_14px_rgba(0,152,234,0.3)] transition-all flex items-center justify-center gap-2 group">
            Continue
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateShop;
