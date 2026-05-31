import { useParams, Link } from "wouter";
import { useGetShop, useListProducts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, Store } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ShopPage() {
  const { shopId } = useParams();
  const { data: shop, isLoading: shopLoading } = useGetShop(Number(shopId) || 0, { query: { enabled: !!shopId } });
  
  // In a real app we'd filter by shopId, mocking the list for now
  const { data: products, isLoading: productsLoading } = useListProducts();

  if (shopLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-48 w-full" />
        <div className="p-4 space-y-4 -mt-10 relative z-10">
          <Skeleton className="h-20 w-20 rounded-xl" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      </div>
    );
  }

  if (!shop) return <div className="p-8 text-center">Shop not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-48 bg-gradient-to-br from-primary/40 to-blue-900/40">
        <Link href="/" className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="px-4 relative -mt-10 z-10">
        <div className="w-20 h-20 bg-card rounded-2xl border-4 border-background flex items-center justify-center overflow-hidden shadow-xl">
          <Store className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <div className="mt-3 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 max-w-[280px]">
              {shop.description || "Welcome to our store!"}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-sm">4.9</span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="font-semibold text-lg">Products</h2>
          
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products?.items.map(product => (
                <Link key={product.id} href={`/product/${product.id}`} className="block">
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover-elevate">
                    <div className="aspect-square bg-muted">
                      {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                      <div className="mt-2 font-bold text-primary">{formatPrice(product.price)} {product.currency}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
