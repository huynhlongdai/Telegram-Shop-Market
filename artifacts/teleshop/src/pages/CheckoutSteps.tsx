import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCreateOrder } from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";

export default function CheckoutSteps() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"USDT" | "TON">("USDT");
  
  const { mutate: createOrder, isPending } = useCreateOrder();

  const handleConfirm = () => {
    // In a real app we'd pass actual product details. Using mocked data for now.
    createOrder(
      { data: { items: [{ productId: 1, quantity: 1, priceAtTime: "12.50" }], totalAmount: "12.50", shippingAddress: address } },
      {
        onSuccess: () => {
          toast({ title: "Order placed successfully!" });
          setLocation("/orders");
        },
        onError: () => {
          toast({ title: "Failed to place order", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-3">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold">Checkout</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Steps indicator */}
        <div className="flex items-center justify-between px-2 mb-8 relative">
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-border -z-10" />
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Delivery Address</h2>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Full Address</label>
              <textarea 
                className="w-full min-h-[100px] p-3 rounded-xl border border-input bg-card text-foreground"
                placeholder="Enter your delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button className="w-full h-12 rounded-full" onClick={() => setStep(2)} disabled={!address}>
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            
            <div className="space-y-3">
              <div 
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === "USDT" ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
                onClick={() => setPaymentMethod("USDT")}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "USDT" ? "border-primary" : "border-muted-foreground"}`}>
                  {paymentMethod === "USDT" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold text-xs">₮</div>
                <div className="flex-1 font-medium">Tether USDT</div>
              </div>

              <div 
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === "TON" ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
                onClick={() => setPaymentMethod("TON")}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "TON" ? "border-primary" : "border-muted-foreground"}`}>
                  {paymentMethod === "TON" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">💎</div>
                <div className="flex-1 font-medium">Toncoin</div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <label className="text-sm text-muted-foreground">Voucher Code (Optional)</label>
              <div className="flex gap-2">
                <Input placeholder="Enter code" className="bg-card" />
                <Button variant="outline">Apply</Button>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-full" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 h-12 rounded-full" onClick={() => setStep(3)}>Review</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-semibold">Review Order</h2>
            
            <div className="bg-card rounded-xl border border-border p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Item Total</span>
                <span className="font-medium">12.50 {paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">0.00 {paymentMethod}</span>
              </div>
              <div className="h-px bg-border w-full" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">12.50 {paymentMethod}</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Delivery Address</h3>
              <p className="text-sm leading-relaxed">{address}</p>
            </div>

            <div className="pt-4 flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-full" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1 h-12 rounded-full" onClick={handleConfirm} disabled={isPending}>
                {isPending ? "Confirming..." : "Confirm & Pay"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
