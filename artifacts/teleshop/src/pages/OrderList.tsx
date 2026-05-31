import { Link } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ChevronRight, Clock, CheckCircle2, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export default function OrderList() {
  const { data: orders, isLoading } = useListOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-orange-500" />;
      case "shipped": return <Truck className="w-4 h-4 text-blue-500" />;
      case "delivered": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Package className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "shipped": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "delivered": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </>
        ) : !orders || orders.items.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No orders yet</h3>
            <p className="text-muted-foreground text-sm">When you place an order, it will appear here.</p>
            <Link href="/" className="inline-block mt-4 text-primary font-medium">Start Shopping</Link>
          </div>
        ) : (
          orders.items.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block">
              <div className="bg-card border border-border rounded-xl p-4 space-y-3 hover-elevate">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Order #{order.id}</span>
                  <Badge variant="outline" className={`capitalize flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="w-12 h-12 bg-muted rounded-lg flex flex-shrink-0 items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Order Total: {formatPrice(order.totalAmount)} USDT</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
