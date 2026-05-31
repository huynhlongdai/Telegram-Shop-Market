import { useState } from "react";
import { useListProducts, useCreateProduct, useDeleteProduct } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

export default function ProductList() {
  const { data: products, isLoading, refetch } = useListProducts({ query: { enabled: true } });
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });

  const handleCreate = () => {
    if (!newProduct.name || !newProduct.price) return;
    createProduct(
      { data: { ...newProduct, currency: "USDT", quantity: 10, shopId: 1 } },
      {
        onSuccess: () => {
          toast({ title: "Product created" });
          setIsAdding(false);
          setNewProduct({ name: "", price: "", description: "" });
          refetch();
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteProduct(id, {
      onSuccess: () => {
        toast({ title: "Product deleted" });
        refetch();
      }
    });
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
              onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
            />
            <Input 
              placeholder="Price (USDT)" 
              type="number"
              value={newProduct.price} 
              onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
            />
            <textarea 
              className="w-full min-h-[80px] p-3 rounded-xl border border-input bg-background text-sm"
              placeholder="Description"
              value={newProduct.description}
              onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleCreate}>Save</Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : products?.items.map(product => (
          <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{product.name}</h3>
              <p className="font-bold text-primary text-xs mt-1">{formatPrice(product.price)} {product.currency}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-full">
                <Edit className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(product.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {(!products || products.items.length === 0) && !isAdding && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No products found. Click "Add" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
