import { Link } from "wouter";
import { useGetMyShop } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, TrendingUp, ShoppingBag, Settings, Zap, Tag } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const data = [
  { name: "Mon", revenue: 400 },
  { name: "Tue", revenue: 300 },
  { name: "Wed", revenue: 550 },
  { name: "Thu", revenue: 450 },
  { name: "Fri", revenue: 700 },
  { name: "Sat", revenue: 650 },
  { name: "Sun", revenue: 800 },
];

export default function MerchantDashboard() {
  const { data: shop, isLoading } = useGetMyShop();

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {shop && <span className="text-sm font-medium bg-primary/20 text-primary px-3 py-1 rounded-full">{shop.name}</span>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Revenue</span>
          </div>
          <div className="text-xl font-bold">3,850 USDT</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-medium">Orders</span>
          </div>
          <div className="text-xl font-bold">124</div>
        </div>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl space-y-4">
        <h2 className="font-semibold text-sm">Revenue (Last 7 days)</h2>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#8899AA" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0E1520", borderColor: "#1E293B", borderRadius: "8px" }}
                itemStyle={{ color: "#0098EA" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#0098EA" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-sm">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/dashboard/products" className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors">
            <Package className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Products</span>
          </Link>
          <Link href="/dashboard/orders" className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Orders</span>
          </Link>
          <Link href="/dashboard/flash-sales" className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors">
            <Zap className="w-6 h-6 text-amber-500" />
            <span className="text-sm font-medium">Flash Sales</span>
          </Link>
          <Link href="/dashboard/vouchers" className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors">
            <Tag className="w-6 h-6 text-emerald-500" />
            <span className="text-sm font-medium">Vouchers</span>
          </Link>
          <Link href="/dashboard/settings" className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors col-span-2">
            <Settings className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Bot & Commission Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
