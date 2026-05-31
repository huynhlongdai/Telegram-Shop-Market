import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User, Settings, Package, LogOut, ExternalLink, Store } from "lucide-react";

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div className="p-8 text-center">Please login</div>;
  }

  return (
    <div className="p-4 space-y-8 pb-20">
      <div className="flex flex-col items-center pt-8 space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full p-1">
          <div className="w-full h-full bg-card rounded-full border-4 border-background flex items-center justify-center overflow-hidden">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">{user.username || "Telegram User"}</h1>
          <p className="text-sm text-muted-foreground font-mono bg-muted px-3 py-1 rounded-full inline-block">
            {user.telegramId}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Account</h3>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <Link href="/orders" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-primary" />
              <span className="font-medium">My Orders</span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link href="/dashboard" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-primary" />
              <span className="font-medium">Merchant Dashboard</span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Settings</h3>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Preferences</span>
            </div>
          </div>
          <div 
            className="flex items-center justify-between p-4 hover:bg-destructive/10 transition-colors cursor-pointer text-destructive"
            onClick={() => {
              logout();
              window.location.href = "/welcome";
            }}
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
