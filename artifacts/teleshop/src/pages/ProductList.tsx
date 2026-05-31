import { useState } from "react";
import { useListProducts, useCreateProduct, useDeleteProduct } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Trash2, Edit, ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

export default function ProductList() {
  const { data: products, isLoading, refetch } = useListProducts();
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    warrantyType: "standard" as "standard" | "none",
    escrowReleaseDays: "3",
  });

  const handleCreate = () => {
    if (!newProduct.name || !newProduct.price) return;
    createProduct(
      {
        data: {
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description || undefined,
          currency: "USDT",
          stock: 10,
          warrantyType: newProduct.warrantyType,
          escrowReleaseDays: parseInt(newProduct.escrowReleaseDays) || 3,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Product created" });
          setIsAdding(false);
          setNewProduct({ name: "", price: "", description: "", warrantyType: "standard", escrowReleaseDays: "3" });
          refetch();
        },
        onError: () => toast({ title: "Failed to create product", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteProduct(
      { productId: id },
      {
        onSuccess: () => {
          toast({ title: "Product deleted" });
          refetch();
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold">Products</h1>
        </div>
        <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {isAdding && (
          <div className="bg-card border border-border p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-4">
            <h3 className="font-semibold">New Product</h3>
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <Input
              placeholder="Price (USDT)"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <textarea
              className="w-full min-h-[70px] p-3 rounded-xl border border-input bg-background text-sm resize-none"
              placeholder="Description (optional)"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Warranty Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setNewProduct({ ...newProduct, warrantyType: "standard" })}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                    newProduct.warrantyType === "standard"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>With Warranty</span>
                </button>
                <button
                  onClick={() => setNewProduct({ ...newProduct, warrantyType: "none" })}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                    newProduct.warrantyType === "none"
                      ? "border-orange-500 bg-orange-500/10 text-orange-500"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <ShieldOff className="w-4 h-4 flex-shrink-0" />
                  <span>No Warranty</span>
                </button>
              </div>

              {newProduct.warrantyType === "none" && (
                <div className="mt-2 space-y-2 animate-in fade-in">
                  <label className="text-xs font-medium text-muted-foreground">
                    Auto-release funds after (days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={newProduct.escrowReleaseDays}
                    onChange={(e) => setNewProduct({ ...newProduct, escrowReleaseDays: e.target.value })}
                  />
                  <p className="text-xs text-orange-500/80">
                    Funds released to seller automatically {newProduct.escrowReleaseDays} day(s) after purchase, without buyer confirmation.
                  </p>
                </div>
              )}
              {newProduct.warrantyType === "standard" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Funds held in escrow until buyer confirms delivery.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleCreate}>
                Save
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : !products?.items.length ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No products yet. Add your first product.
          </div>
        ) : (
          products.items.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-bold text-primary text-xs">
                    {formatPrice(product.price)} {product.currency}
                  </p>
                  {product.warrantyType === "none" ? (
                    <span className="flex items-center gap-1 text-xs text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                      <ShieldOff className="w-3 h-3" />
                      {product.escrowReleaseDays}d release
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      Warranty
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="w-8 h-8 rounded-full">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full text-red-500 hover:text-red-400"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
