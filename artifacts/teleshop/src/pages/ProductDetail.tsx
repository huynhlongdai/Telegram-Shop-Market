import { useGetProduct } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Store, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ProductDetail() {
  const { productId } = useParams();
  const { data: product, isLoading } = useGetProduct(productId || "");

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full aspect-square" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="relative pb-24">
      <Link href="/" className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="w-full aspect-square bg-muted relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
        )}
      </div>

      <div className="p-5 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
          </div>
          <div className="text-2xl font-bold text-primary mt-1">
            {formatPrice(product.price)} <span className="text-base text-primary/80">{product.currency}</span>
          </div>
        </div>

        <Link href={`/shop/${product.shopId}`} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <Store className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">View Shop</h3>
            <p className="text-xs text-muted-foreground">Official Merchant</p>
          </div>
        </Link>

        <div className="space-y-3 pt-2">
          <h3 className="font-medium">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description || "No description provided."}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Secure crypto payment via Telegram Wallet</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-4 bg-background/80 backdrop-blur-xl border-t border-border z-50">
        <Link href="/checkout">
          <Button className="w-full h-12 rounded-full text-base font-semibold shadow-lg shadow-primary/20">
            Buy Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
