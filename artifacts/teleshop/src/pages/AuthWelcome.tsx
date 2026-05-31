import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuthTelegram } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

export default function AuthWelcome() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { mutate: authTelegram, isPending } = useAuthTelegram();

  const handleDevLogin = () => {
    authTelegram(
      { data: { initData: "dev_mode" } },
      {
        onSuccess: (data) => {
          login(data.token, data.user);
          setLocation("/");
        }
      }
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-[url('/bg-glow.svg')] bg-cover bg-center">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm space-y-8">
        <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/30 shadow-[0_0_40px_rgba(0,152,234,0.3)]">
          <div className="w-12 h-12 bg-primary rounded-xl" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">TeleShop</h1>
          <p className="text-muted-foreground text-sm">The crypto-native marketplace inside Telegram</p>
        </div>

        <div className="w-full space-y-3 pt-8">
          <Button 
            className="w-full h-12 rounded-full text-base font-semibold"
            size="lg"
            onClick={handleDevLogin}
            disabled={isPending}
          >
            {isPending ? "Connecting..." : "Sign in with Telegram"}
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-full text-base border-border bg-transparent hover:bg-muted"
            onClick={() => setLocation("/")}
          >
            Browse as Guest
          </Button>
        </div>
        
        <div className="pt-4">
          <Link href="/register-shop" className="text-sm text-primary hover:underline font-medium">
            Open a Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
