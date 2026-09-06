import { useMemo, useState } from "react";
import { useListProducts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Search, ArrowRight, ShieldCheck, Timer, PackageCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const categories = ["All", "Accounts", "Software", "Subscriptions", "Services"];

export default function Home() {
  const { t } = useTranslation();
  const { data: products, isLoading } = useListProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const visibleProducts = useMemo(() => {
    const items = products?.items ?? [];
    return items.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory = category === "All" || product.category?.toLowerCase() === category.toLowerCase();
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <div className="space-y-7 px-4 py-5">
      <section>
        <p className="eyebrow mb-3">Verified digital commerce</p>
        <h1 className="max-w-[330px] text-[30px] font-semibold leading-[1.08] tracking-[-0.045em]">Compare offers. Buy from sellers with proof.</h1>
        <p className="mt-3 max-w-[360px] text-sm leading-6 text-muted-foreground">Price, delivery speed and transaction history — visible before you pay.</p>
      </section>

      <section className="space-y-3" aria-label="Product search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("home.searchPlaceholder")} className="h-12 rounded-lg border-white/[0.09] bg-[#11141a] pl-10 text-sm placeholder:text-muted-foreground" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`min-h-10 shrink-0 rounded-md border px-3 text-xs font-medium transition-colors ${category === item ? "border-primary bg-primary text-primary-foreground" : "border-white/[0.09] bg-card text-muted-foreground hover:text-foreground"}`}>{item}</button>)}
        </div>
      </section>

      <section className="app-surface grid grid-cols-3 divide-x divide-white/[0.07] p-1">
        <Signal icon={ShieldCheck} value="Verified" label="merchant data" />
        <Signal icon={Timer} value="Tracked" label="delivery SLA" />
        <Signal icon={PackageCheck} value="Protected" label="order record" />
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between"><div><p className="eyebrow mb-1.5">Marketplace</p><h2 className="text-lg font-semibold tracking-[-0.025em]">Active offers</h2></div><span className="font-mono text-[10px] text-muted-foreground">{visibleProducts.length} LISTED</span></div>
        {isLoading ? <div className="space-y-3">{[1,2,3].map((item) => <Skeleton key={item} className="h-[112px] rounded-[10px]" />)}</div> : visibleProducts.length > 0 ? (
          <div className="space-y-3">{visibleProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="app-surface group flex min-h-[112px] gap-3 p-3 transition-colors hover:border-white/[0.16]">
              <div className="h-[86px] w-[86px] shrink-0 overflow-hidden rounded-lg bg-[#0d1015]">{product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-mono text-xs text-muted-foreground">DIGITAL</div>}</div>
              <div className="flex min-w-0 flex-1 flex-col"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{product.name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{product.category || "Digital product"}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></div><div className="mt-auto flex items-end justify-between gap-3"><div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Recorded purchase</div><div className="text-right"><p className="eyebrow mb-1">From</p><p className="mono-value text-sm font-semibold text-primary">{formatPrice(product.price)} {product.currency}</p></div></div></div>
            </Link>
          ))}</div>
        ) : <div className="app-surface px-5 py-10 text-center"><p className="text-sm font-medium">No matching offers</p><p className="mt-1 text-xs text-muted-foreground">Try a different keyword or category.</p></div>}
      </section>
    </div>
  );
}

function Signal({ icon: Icon, value, label }: { icon: typeof ShieldCheck; value: string; label: string }) { return <div className="px-2 py-3 text-center"><Icon className="mx-auto mb-2 h-4 w-4 text-primary" /><p className="text-[11px] font-medium">{value}</p><p className="mt-0.5 text-[9px] text-muted-foreground">{label}</p></div>; }
