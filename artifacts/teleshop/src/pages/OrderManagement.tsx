import { Link } from "wouter";
import { useListOrders, useUpdateOrderStatus } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, Truck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function OrderManagement() {
  const { data: orders, isLoading, refetch } = useListOrders({ query: { enabled: true } });
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleStatusUpdate = (orderId: number, status: "pending" | "shipped" | "delivered" | "cancelled") => {
    updateStatus(
      { orderId, data: { status } },
      {
        onSuccess: () => {
          toast({ title: `Order marked as ${status}` });
          refetch();
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-3">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold">Manage Orders</h1>
      </div>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : !orders || orders.items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No orders yet.
          </div>
        ) : (
          orders.items.map(order => (
            <div key={order.id} className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">Order #{order.id}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{order.totalAmount} USDT</p>
                  <p className="text-xs font-medium uppercase mt-1 text-muted-foreground">{order.status}</p>
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-3 text-sm">
                <p className="text-muted-foreground text-xs mb-1">Shipping to:</p>
                <p className="line-clamp-2">{order.shippingAddress}</p>
              </div>

              {order.status === "pending" && (
                <Button 
                  className="w-full" 
                  onClick={() => handleStatusUpdate(order.id, "shipped")}
                  disabled={isPending}
                >
                  <Truck className="w-4 h-4 mr-2" /> Mark as Shipped
                </Button>
              )}
              {order.status === "shipped" && (
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white" 
                  onClick={() => handleStatusUpdate(order.id, "delivered")}
                  disabled={isPending}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Delivered
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
