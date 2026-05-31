import { Link, useLocation } from "wouter";
import { Home, ShoppingBag, ListOrdered, Share2, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t } = useTranslation();

  const showNav = location !== "/welcome";

  return (
    <div className="bg-black min-h-[100dvh] flex items-center justify-center">
      <div className="w-full max-w-[390px] min-h-[100dvh] bg-background text-foreground relative flex flex-col mx-auto overflow-hidden shadow-2xl">
        <div className="flex-1 overflow-y-auto pb-16">
          {children}
        </div>
        
        {showNav && (
          <nav className="absolute bottom-0 w-full h-16 bg-card border-t border-border flex items-center justify-around z-50">
            <NavItem href="/" icon={Home} label={t("nav.home")} active={location === "/"} />
            <NavItem href="/shop" icon={ShoppingBag} label={t("nav.shop")} active={location.startsWith("/shop")} />
            <NavItem href="/orders" icon={ListOrdered} label={t("nav.orders")} active={location.startsWith("/orders")} />
            <NavItem href="/affiliate" icon={Share2} label={t("nav.affiliate")} active={location.startsWith("/affiliate")} />
            <NavItem href="/profile" icon={User} label={t("nav.profile")} active={location.startsWith("/profile")} />
          </nav>
        )}
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center gap-1 w-full h-full justify-center ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
