import { Link, useLocation } from "wouter";
import { Compass, ListOrdered, Share2, User, Store } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t } = useTranslation();
  const showNav = location !== "/welcome";
  const isMerchant = location.startsWith("/dashboard");

  return (
    <div className="min-h-[100dvh] bg-[#090b0f] text-foreground">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col border-x border-white/[0.06] bg-background">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.07] bg-background/95 px-4 backdrop-blur-xl">
          <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="TeleShop home">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary font-mono text-xs font-bold text-primary-foreground">T</span>
            <span className="text-sm font-semibold tracking-[-0.02em]">TeleShop</span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            <span className="status-dot" /> Network online
          </div>
        </header>

        <main className={`flex-1 ${showNav ? "pb-20" : ""}`}>{children}</main>

        {showNav && (
          <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 mx-auto flex min-h-[68px] w-full max-w-[430px] items-start justify-around border-t border-white/[0.08] bg-[#0b0e13]/95 px-1 pt-2 backdrop-blur-xl" aria-label="Primary navigation">
            <NavItem href="/" icon={Compass} label={t("nav.home")} active={location === "/" || location.startsWith("/product")} />
            <NavItem href="/dashboard" icon={Store} label={isMerchant ? "Console" : t("nav.shop")} active={isMerchant} />
            <NavItem href="/orders" icon={ListOrdered} label={t("nav.orders")} active={location.startsWith("/orders")} />
            <NavItem href="/affiliate" icon={Share2} label={t("nav.affiliate")} active={location.startsWith("/affiliate")} />
            <NavItem href="/profile" icon={User} label={t("nav.profile")} active={location.startsWith("/profile")} />
          </nav>
        )}
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: typeof Compass; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex min-h-11 min-w-[64px] flex-col items-center justify-center gap-1 rounded-lg px-2 transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`} aria-current={active ? "page" : undefined}>
      <Icon className="h-[19px] w-[19px]" strokeWidth={active ? 2.3 : 1.8} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
