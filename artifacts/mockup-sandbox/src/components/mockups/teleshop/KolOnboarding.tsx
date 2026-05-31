import React, { useState } from "react";
import { Check, Send, Copy, ShieldCheck, Star, Award, CheckCircle2, Info, CheckCircle, ChevronRight, Shield, Activity, Users, Tag } from "lucide-react";

export function KolOnboarding() {
  const [channelUsername, setChannelUsername] = useState("@phonezonereview");
  const [isVerified, setIsVerified] = useState(true);
  const [postText, setPostText] = useState(
    "I'm now an official TeleShop partner! Shop for verified crypto deals at t.me/TeleShopBot — use my link for exclusive discounts."
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-center bg-black min-h-screen font-sans text-white py-8">
      <div className="w-full max-w-[390px] bg-[#0a0a0c] min-h-[844px] rounded-[32px] overflow-hidden shadow-2xl border border-white/5 flex flex-col relative">
        
        {/* Header */}
        <div className="px-6 pt-10 pb-4 border-b border-white/10 bg-[#0f0f12]">
          <div className="flex items-center space-x-1.5 mb-6 text-[10px] font-medium tracking-wider uppercase">
            <span className="text-[#a0a0a0] flex items-center">
              1 Profile <Check className="w-3 h-3 ml-1 text-green-500" />
            </span>
            <span className="text-white/20">/</span>
            <span className="text-[#e2b764]">2 Verify Channel</span>
            <span className="text-white/20">/</span>
            <span className="text-[#505050]">3 Activate</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Verify Your Telegram Channel</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 custom-scrollbar pb-24">
          
          {/* Hero Explanation Card */}
          <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-[#e2b764]/40 to-[#e2b764]/5">
            <div className="bg-[#12110e] rounded-2xl p-5 w-full h-full">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-[#e2b764] fill-[#e2b764]/20" />
                <h2 className="text-lg font-medium text-[#f0dfad]">KOL Partner Benefits</h2>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e2b764] mt-1.5 mr-3 flex-shrink-0" />
                  <span className="text-[#e2b764] font-medium">8% commission rate <span className="text-[#888] font-normal ml-1">(vs 5% standard)</span></span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e2b764]/50 mt-1.5 mr-3 flex-shrink-0" />
                  <span className="text-[#d0d0d0]">Priority support & dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e2b764]/50 mt-1.5 mr-3 flex-shrink-0" />
                  <span className="text-[#d0d0d0]">Exclusive KOL badge on your affiliate links</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Verification Form */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-[#b0b0b0]">Enter your Telegram channel username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Send className="w-4 h-4 text-[#707070]" />
              </div>
              <input 
                type="text" 
                value={channelUsername}
                onChange={(e) => setChannelUsername(e.target.value)}
                className="w-full bg-[#161618] border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#e2b764]/50 focus:ring-1 focus:ring-[#e2b764]/50 transition-colors"
                placeholder="@username"
              />
            </div>
            
            {!isVerified ? (
              <button 
                onClick={() => setIsVerified(true)}
                className="w-full bg-[#2a2a2c] hover:bg-[#323235] text-white font-medium py-3.5 rounded-xl transition-colors"
              >
                Verify Channel
              </button>
            ) : (
              <div className="bg-[#0b1610] border border-green-500/20 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="font-medium text-green-400">Channel verified: {channelUsername}</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mt-2">
                  <div className="flex flex-col">
                    <span className="text-[#707070] text-xs mb-0.5 flex items-center"><Users className="w-3 h-3 mr-1"/> Members</span>
                    <span className="text-green-400 font-medium tracking-tight">15,847</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#707070] text-xs mb-0.5 flex items-center"><Tag className="w-3 h-3 mr-1"/> Category</span>
                    <span className="text-[#c0c0c0]">Tech & Gadgets</span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-[#707070] text-xs mb-0.5 flex items-center"><Activity className="w-3 h-3 mr-1"/> Avg Engagement</span>
                    <span className="text-[#c0c0c0]">4.2%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Requirements Checklist */}
          {isVerified && (
            <div className="bg-[#121214] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-4">Requirements Status</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-[#b0b0b0]">Channel has {">"}10,000 members <span className="text-[#606060] ml-1">(yours: 15,847)</span></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-[#b0b0b0]">Channel is public</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-[#b0b0b0]">Posts in last 30 days: 24 <span className="text-[#606060] ml-1">(min: 4)</span></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-[#b0b0b0]">No community guideline violations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-4 h-4 border border-[#505050] rounded-sm mt-0.5 mr-3 flex-shrink-0 bg-transparent" />
                  <span className="text-sm text-white font-medium">TeleShop post required <span className="block text-xs text-[#707070] font-normal mt-1">Post about TeleShop once to complete verification</span></span>
                </li>
              </ul>
            </div>
          )}

          {/* Required Post Section */}
          {isVerified && (
            <div className="bg-[#1a1711] border border-[#e2b764]/20 rounded-xl p-5">
              <p className="text-sm text-[#e2b764] mb-3">To complete KOL onboarding, post this in your channel:</p>
              <div className="relative mb-3">
                <textarea 
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="w-full bg-[#110f0b] border border-[#e2b764]/10 rounded-lg p-3.5 text-sm text-[#d0d0d0] focus:outline-none focus:border-[#e2b764]/40 min-h-[100px] resize-none"
                />
              </div>
              <button 
                onClick={handleCopy}
                className="w-full flex items-center justify-center space-x-2 bg-transparent border border-[#e2b764]/30 hover:bg-[#e2b764]/10 text-[#e2b764] text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied to clipboard" : "Copy Post Text"}</span>
              </button>
            </div>
          )}
          
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c] to-transparent border-t border-white/5 pt-12">
          <button className="w-full bg-gradient-to-r from-[#e2b764] to-[#c99a3b] hover:from-[#f0dfad] hover:to-[#e2b764] text-black font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(226,183,100,0.15)] transition-all flex items-center justify-center space-x-2">
            <span>I've posted — Verify Now</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center mt-4 space-x-1.5 text-[#606060]">
            <Info className="w-3.5 h-3.5" />
            <p className="text-[11px]">Admin reviews within 24 hours. You'll receive a Telegram notification when approved.</p>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
