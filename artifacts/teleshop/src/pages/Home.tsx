import { useListProducts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Search, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

export default function Home() {
  const { data: products, isLoading } = useListProducts();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">TeleShop</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search products..." className="pl-9 bg-card border-border rounded-full" />
      </div>

      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 flex items-center gap-3">
        <div className="bg-orange-500/20 p-2 rounded-full">
          <Flame className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="font-medium text-orange-500">Flash Sale</h3>
          <p className="text-xs text-muted-foreground">Up to 50% off premium assets</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Trending Now</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
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
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-primary">{formatPrice(product.price)} {product.currency}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {(!products || products.items.length === 0) && (
              <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
                No products found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
