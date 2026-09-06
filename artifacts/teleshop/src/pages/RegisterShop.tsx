import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ArrowLeft, Store, ShieldCheck, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCreateShop } from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";

const plans = [
  { name: "Starter", value: "starter" as const, price: "30 USDT", note: "Launch a focused catalog", features: ["10 products", "Basic analytics", "Standard support"] },
  { name: "Growth", value: "growth" as const, price: "80 USDT", note: "Operate a growing shop", features: ["100 products", "Advanced analytics", "Custom vouchers"] },
  { name: "Pro", value: "pro" as const, price: "200 USDT", note: "Build a distribution network", features: ["Unlimited products", "API access", "Affiliate program"] },
];

export default function RegisterShop() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<(typeof plans)[number]["value"]>("growth");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: createShop, isPending } = useCreateShop();

  const changeName = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  const submit = () => {
    if (name.trim().length < 2 || slug.trim().length < 2) {
      toast({ title: "Enter a valid shop name and slug", variant: "destructive" });
      return;
    }
    createShop(
      { data: { name: name.trim(), slug: slug.trim(), description: description.trim() || undefined, plan: selected } },
      {
        onSuccess: () => {
          toast({ title: "Shop application created", description: "Your shop is ready for review." });
          setLocation("/dashboard");
        },
        onError: (error: Error) => toast({ title: "Could not create shop", description: error.message, variant: "destructive" }),
      },
    );
  };

  return <div className="pb-8">
    <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3"><Link href="/welcome" className="grid h-11 w-11 place-items-center rounded-lg border border-white/[0.09] bg-card"><ArrowLeft className="h-4 w-4" /></Link><div><p className="eyebrow mb-1">Merchant onboarding</p><p className="text-sm font-medium">Open a shop</p></div></div>
    <div className="space-y-6 px-4 py-5">
      <section><span className="grid h-12 w-12 place-items-center rounded-lg border border-primary/20 bg-primary/[0.06] text-primary"><Store className="h-5 w-5" /></span><h1 className="mt-5 text-[28px] font-semibold leading-[1.08] tracking-[-0.04em]">Create your merchant identity.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Your shop starts in review status. Plan billing remains separate until the payment workflow is implemented.</p></section>
      <section className="app-surface space-y-4 p-4"><div><p className="eyebrow mb-1.5">Shop profile</p><h2 className="text-lg font-semibold">Public storefront details</h2></div><Field label="Shop name"><Input value={name} onChange={(event) => changeName(event.target.value)} placeholder="Acme Digital" className="h-11 rounded-lg bg-[#0d1015]" /></Field><Field label="Store slug"><div className="flex h-11 items-center rounded-lg border border-white/[0.09] bg-[#0d1015] px-3"><span className="font-mono text-xs text-muted-foreground">@</span><input value={slug} onChange={(event) => setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="acme-digital" className="min-w-0 flex-1 bg-transparent px-1 font-mono text-xs outline-none" /></div></Field><Field label="Description"><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="What your shop sells and how fulfillment works" className="w-full resize-none rounded-lg border border-white/[0.09] bg-[#0d1015] p-3 text-sm leading-6 outline-none focus:border-primary" /></Field></section>
      <section><p className="eyebrow mb-3">Operating plan</p><div className="space-y-3">{plans.map((plan) => { const active = selected === plan.value; return <button key={plan.value} onClick={() => setSelected(plan.value)} className={`app-surface w-full p-4 text-left ${active ? "border-primary/40 bg-primary/[0.03]" : ""}`}><div className="flex items-start justify-between gap-3"><div><p className="eyebrow mb-1.5">{plan.note}</p><h3 className="text-lg font-semibold">{plan.name}</h3></div><p className="mono-value text-sm font-semibold text-primary">{plan.price}</p></div><div className="mt-4 grid gap-2">{plan.features.map((feature) => <span key={feature} className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5 text-primary" />{feature}</span>)}</div>{active && <div className="mt-4 flex items-center gap-2 border-t border-white/[0.07] pt-3 font-mono text-[10px] uppercase text-primary"><ShieldCheck className="h-3.5 w-3.5" />Selected plan</div>}</button>; })}</div></section>
      <Button onClick={submit} disabled={isPending || name.trim().length < 2 || slug.trim().length < 2} className="h-12 w-full rounded-lg font-mono text-xs font-bold uppercase tracking-[0.08em]">{isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating…</> : "Submit shop application"}</Button>
      <p className="text-center text-[10px] leading-4 text-muted-foreground">Submitting creates the shop record only. It does not charge the displayed plan price.</p>
    </div>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="eyebrow mb-2 block">{label}</span>{children}</label>; }
