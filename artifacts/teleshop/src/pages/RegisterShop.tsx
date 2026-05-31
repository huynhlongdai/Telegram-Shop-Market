import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "wouter";

const PLANS = [
  { name: "Starter", price: "30 USDT", features: ["10 Products", "Basic Analytics", "Standard Support"] },
  { name: "Growth", price: "80 USDT", features: ["100 Products", "Advanced Analytics", "Priority Support", "Custom Vouchers"] },
  { name: "Pro", price: "200 USDT", features: ["Unlimited Products", "API Access", "24/7 Support", "Affiliate Program"] },
];

export default function RegisterShop() {
  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Open a Shop</h1>
        <p className="text-muted-foreground text-sm">Choose a plan to start selling</p>
      </div>

      <div className="space-y-4">
        {PLANS.map(plan => (
          <Card key={plan.name} className="p-5 border-border bg-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <span className="text-primary font-bold">{plan.price}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button className="w-full rounded-full">Select {plan.name}</Button>
          </Card>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <Link href="/welcome" className="text-sm text-muted-foreground hover:text-foreground">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
