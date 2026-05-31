import { useParams, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, Clock, Truck, CheckCircle2, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

export default function OrderDetail() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useGetOrder(Number(orderId) || 0, { query: { enabled: !!orderId } });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) return <div className="p-8 text-center">Order not found</div>;

  const statuses = ["pending", "shipped", "delivered"];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-3">
        <Link href="/orders" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold">Order #{order.id}</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-6">Tracking Status</h2>
          
          <div className="relative pl-6 space-y-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
            
            <div className="relative z-10">
              <div className={`absolute -left-[31px] w-6 h-6 rounded-full flex items-center justify-center ${currentStatusIndex >= 0 ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border text-muted-foreground'}`}>
                <Clock className="w-3 h-3" />
              </div>
              <div>
                <p className={`font-medium ${currentStatusIndex >= 0 ? 'text-foreground' : 'text-muted-foreground'}`}>Order Placed</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="relative z-10">
              <div className={`absolute -left-[31px] w-6 h-6 rounded-full flex items-center justify-center ${currentStatusIndex >= 1 ? 'bg-blue-500 text-white' : 'bg-muted border border-border text-muted-foreground'}`}>
                <Truck className="w-3 h-3" />
              </div>
              <div>
                <p className={`font-medium ${currentStatusIndex >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Shipped</p>
                {currentStatusIndex >= 1 && <p className="text-xs text-muted-foreground mt-1">Your order is on the way</p>}
              </div>
            </div>

            <div className="relative z-10">
              <div className={`absolute -left-[31px] w-6 h-6 rounded-full flex items-center justify-center ${currentStatusIndex >= 2 ? 'bg-green-500 text-white' : 'bg-muted border border-border text-muted-foreground'}`}>
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <div>
                <p className={`font-medium ${currentStatusIndex >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Delivered</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold">Order Summary</h2>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Product Item (placeholder)</p>
              <p className="text-xs text-muted-foreground">Qty: 1</p>
            </div>
            <div className="font-semibold">{formatPrice(order.totalAmount)} USDT</div>
          </div>

          <div className="h-px bg-border w-full" />
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Shipping Address</span>
            <span className="font-medium max-w-[150px] truncate">{order.shippingAddress}</span>
          </div>

          <div className="h-px bg-border w-full" />
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Paid</span>
            <span className="text-primary">{formatPrice(order.totalAmount)} USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
