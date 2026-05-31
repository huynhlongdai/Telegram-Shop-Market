import React, { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  Copy, 
  Settings2, 
  MoreVertical, 
  Percent, 
  DollarSign, 
  Truck,
  RefreshCw,
  CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function VoucherSetup() {
  const [createExpanded, setCreateExpanded] = useState(true);

  return (
    <div className="flex justify-center w-full min-h-screen bg-black text-slate-200 font-sans p-4 sm:p-8">
      {/* Mobile container constraint */}
      <div className="w-full max-w-[390px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative h-[844px]">
        
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-slate-100 tracking-tight">Vouchers & Coupons</h1>
          </div>
          <Button size="sm" className="bg-[#0088CC] hover:bg-[#0077B3] text-white rounded-full h-8 px-3 text-xs font-medium border-0">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Create
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 pb-24 scrollbar-hide">
          
          {/* Stats Bar */}
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-slate-200">3</span>
              <span>Active</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-slate-700" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-slate-200">1,204</span>
              <span>Total uses</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-slate-700" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[#0088CC]">847 USDT</span>
              <span>Saved buyers</span>
            </div>
          </div>

          {/* Active Vouchers List */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider ml-1">Active Vouchers</h2>
            
            {/* Card 1 */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex">
              <div className="w-1 bg-[#0088CC]"></div>
              <div className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-dashed border-slate-950 opacity-40"></div>
              
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono text-sm font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
                      SUMMER20
                      <Copy className="h-3 w-3 text-slate-500 cursor-pointer hover:text-slate-300" />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase bg-slate-800/50 text-[#0088CC] border-[#0088CC]/30 font-semibold rounded-sm">
                      % Discount
                    </Badge>
                  </div>
                  <Switch checked={true} className="data-[state=checked]:bg-[#0088CC]" />
                </div>
                
                <div className="text-2xl font-bold text-white mb-2 tracking-tight">-20%</div>
                
                <div className="text-xs text-slate-400 space-y-1 mb-3">
                  <div>Min order: 10 USDT &bull; Max uses: 100</div>
                  <div className="text-amber-500 font-medium">Expires Jun 30, 2025</div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>47 used</span>
                    <span>100 limit</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0088CC] rounded-full" style={{ width: '47%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex">
              <div className="w-1 bg-[#0088CC]"></div>
              <div className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-dashed border-slate-950 opacity-40"></div>
              
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono text-sm font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
                      NEWBUYER
                      <Copy className="h-3 w-3 text-slate-500 cursor-pointer hover:text-slate-300" />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase bg-slate-800/50 text-emerald-400 border-emerald-400/30 font-semibold rounded-sm">
                      Fixed Amount
                    </Badge>
                  </div>
                  <Switch checked={true} className="data-[state=checked]:bg-[#0088CC]" />
                </div>
                
                <div className="text-2xl font-bold text-white mb-2 tracking-tight">-5 USDT</div>
                
                <div className="text-xs text-slate-400 space-y-1 mb-3">
                  <div>First order only &bull; Max uses: 50</div>
                  <div>No expiry date</div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>12 used</span>
                    <span>50 limit</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 (Expired) */}
            <div className="relative bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden flex opacity-60 grayscale-[0.5]">
              <div className="w-1 bg-slate-600"></div>
              <div className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-dashed border-slate-950 opacity-40"></div>
              
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono text-sm font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                      CLEAROUT
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase bg-slate-800/50 text-slate-400 border-slate-700 font-semibold rounded-sm">
                      EXPIRED
                    </Badge>
                  </div>
                  <Switch checked={false} disabled />
                </div>
                
                <div className="text-2xl font-bold text-slate-400 mb-2 tracking-tight">-30%</div>
                
                <div className="text-xs text-slate-500 space-y-1 mb-3">
                  <div>Min order: 20 USDT &bull; Max uses: 100</div>
                  <div>Expired Dec 31, 2024</div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>100 used</span>
                    <span>100 limit</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Create Voucher Form */}
          {createExpanded && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100 tracking-tight">Create New Voucher</h2>
              </div>

              {/* Code */}
              <div className="space-y-2">
                <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Voucher Code</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      value="FLASH30"
                      className="bg-slate-900 border-slate-800 text-slate-100 font-mono font-bold tracking-widest text-lg uppercase pl-4"
                      readOnly
                    />
                  </div>
                  <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 px-3">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Discount Type */}
              <div className="space-y-2">
                <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Discount Type</Label>
                <Tabs defaultValue="percent" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800 h-10 p-1">
                    <TabsTrigger value="percent" className="text-xs data-[state=active]:bg-[#0088CC] data-[state=active]:text-white rounded-md">
                      % Off
                    </TabsTrigger>
                    <TabsTrigger value="fixed" className="text-xs data-[state=active]:bg-[#0088CC] data-[state=active]:text-white rounded-md">
                      Fixed USDT
                    </TabsTrigger>
                    <TabsTrigger value="shipping" className="text-xs data-[state=active]:bg-[#0088CC] data-[state=active]:text-white rounded-md">
                      Free Ship
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Value & Min Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Discount Value</Label>
                  <div className="relative">
                    <Input value="30" className="bg-slate-900 border-slate-800 text-slate-100 pr-8 font-semibold" readOnly />
                    <Percent className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Min Order</Label>
                  <div className="relative">
                    <Input value="15" className="bg-slate-900 border-slate-800 text-slate-100 pr-12 font-semibold" readOnly />
                    <span className="absolute right-3 top-2.5 text-xs font-medium text-slate-500">USDT</span>
                  </div>
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-4 pt-2 border-t border-slate-800/50">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-200">Total Uses Limit</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Unlimited</span>
                    <Switch checked={false} />
                  </div>
                </div>
                <Input value="200" className="bg-slate-900 border-slate-800 text-slate-100 font-semibold" readOnly />

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-200">Per User Limit</Label>
                  <Input value="1 use per buyer" className="bg-slate-900 border-slate-800 text-slate-100" readOnly />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 pt-2 border-t border-slate-800/50">
                <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Valid Period (UTC)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative flex items-center">
                    <CalendarIcon className="absolute left-3 h-4 w-4 text-slate-500" />
                    <Input value="Jun 1, 00:00" className="bg-slate-900 border-slate-800 text-slate-100 pl-9 text-xs" readOnly />
                  </div>
                  <div className="relative flex items-center">
                    <CalendarIcon className="absolute left-3 h-4 w-4 text-slate-500" />
                    <Input value="Jun 3, 23:59" className="bg-slate-900 border-slate-800 text-slate-100 pl-9 text-xs" readOnly />
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-3 pt-2 border-t border-slate-800/50">
                <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Target Audience</Label>
                <RadioGroup defaultValue="followers" className="space-y-2">
                  <div className="flex items-center space-x-3 bg-slate-900/50 border border-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-900 transition-colors">
                    <RadioGroupItem value="all" id="r1" className="border-slate-600 text-[#0088CC]" />
                    <Label htmlFor="r1" className="text-sm font-medium text-slate-200 cursor-pointer flex-1">All buyers</Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-900 border border-[#0088CC]/30 p-3 rounded-lg cursor-pointer transition-colors relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0088CC]"></div>
                    <RadioGroupItem value="followers" id="r2" className="border-slate-600 text-[#0088CC]" />
                    <Label htmlFor="r2" className="text-sm font-medium text-slate-100 cursor-pointer flex-1">Followers only</Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-900/50 border border-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-900 transition-colors">
                    <RadioGroupItem value="vip" id="r3" className="border-slate-600 text-[#0088CC]" />
                    <Label htmlFor="r3" className="text-sm font-medium text-slate-200 cursor-pointer flex-1">VIP buyers {'>'}5 orders</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Broadcast Options */}
              <div className="flex items-start space-x-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <Checkbox id="broadcast" checked={true} className="data-[state=checked]:bg-[#0088CC] data-[state=checked]:border-[#0088CC] mt-0.5" />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="broadcast"
                    className="text-sm font-medium text-slate-200 leading-none cursor-pointer"
                  >
                    Broadcast to followers
                  </Label>
                  <p className="text-xs text-slate-400">
                    Send a notification message to your followers when this voucher goes active.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button className="w-full bg-[#0088CC] hover:bg-[#0077B3] text-white rounded-xl h-12 font-semibold text-[15px] border-0 shadow-lg shadow-[#0088CC]/20">
                  Create & Activate
                </Button>
                <Button variant="outline" className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl h-12 font-medium">
                  Save as Draft
                </Button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
