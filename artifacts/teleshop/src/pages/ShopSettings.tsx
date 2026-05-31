import { useState } from "react";
import { Link } from "wouter";
import {
  useGetMyShop,
  useUpdateShopBot,
  useListCommissionTiers,
  useCreateCommissionTier,
  useUpdateCommissionTier,
  useDeleteCommissionTier,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Bot, Bell, Plus, Trash2, Percent, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

export default function ShopSettings() {
  const { data: shop, isLoading: shopLoading, refetch: refetchShop } = useGetMyShop();

  const shopId = shop?.id;

  const { data: tiersData, isLoading: tiersLoading, refetch: refetchTiers } = useListCommissionTiers(
    shopId ? { shopId } : undefined
  );

  const { mutate: updateBot, isPending: botSaving } = useUpdateShopBot();
  const { mutate: createTier } = useCreateCommissionTier();
  const { mutate: updateTier } = useUpdateCommissionTier();
  const { mutate: deleteTier } = useDeleteCommissionTier();

  const [botForm, setBotForm] = useState({ botToken: "", notificationChatId: "" });
  const [botEditing, setBotEditing] = useState(false);
  const [newTier, setNewTier] = useState({ minOrderAmount: "", maxOrderAmount: "", commissionPercent: "" });
  const [addingTier, setAddingTier] = useState(false);

  const handleSaveBot = () => {
    updateBot(
      {
        data: {
          botToken: botForm.botToken || null,
          notificationChatId: botForm.notificationChatId || null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Bot settings saved" });
          setBotEditing(false);
          refetchShop();
        },
        onError: () => toast({ title: "Failed to save bot settings", variant: "destructive" }),
      }
    );
  };

  const handleAddTier = () => {
    if (!newTier.minOrderAmount || !newTier.commissionPercent || !shopId) return;
    createTier(
      {
        data: {
          shopId,
          minOrderAmount: newTier.minOrderAmount,
          maxOrderAmount: newTier.maxOrderAmount || undefined,
          commissionPercent: newTier.commissionPercent,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Commission tier added" });
          setNewTier({ minOrderAmount: "", maxOrderAmount: "", commissionPercent: "" });
          setAddingTier(false);
          refetchTiers();
        },
        onError: () => toast({ title: "Failed to add tier", variant: "destructive" }),
      }
    );
  };

  const handleToggleTier = (tier: { id: number; isActive: boolean }) => {
    updateTier(
      { tierId: tier.id, data: { isActive: !tier.isActive } },
      { onSuccess: () => refetchTiers() }
    );
  };

  const handleDeleteTier = (tierId: number) => {
    deleteTier(
      { tierId },
      { onSuccess: () => { toast({ title: "Tier deleted" }); refetchTiers(); } }
    );
  };

  if (shopLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p className="mb-4">No shop found. Create one first.</p>
        <Link href="/register-shop" className="text-primary font-medium">Create Shop</Link>
      </div>
    );
  }

  const tiers = tiersData?.items ?? [];
  const shopTiers = tiers.filter((t) => t.shopId !== null);
  const platformTiers = tiers.filter((t) => t.shopId === null);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-3">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold">Shop Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Bot Notification Settings */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Telegram Bot Notifications</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Receive order alerts via your own bot</p>
            </div>
          </div>

          {!botEditing ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Bot Token</span>
                <span className="text-sm font-medium font-mono">
                  {shop.botToken
                    ? "••••" + shop.botToken.slice(-8)
                    : <span className="text-muted-foreground">Not set</span>}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Chat ID</span>
                <span className="text-sm font-medium flex items-center gap-1.5">
                  {shop.notificationChatId ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-mono">{shop.notificationChatId}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setBotForm({
                    botToken: shop.botToken ?? "",
                    notificationChatId: shop.notificationChatId ?? "",
                  });
                  setBotEditing(true);
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                {shop.botToken ? "Update Bot Settings" : "Connect Bot"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bot Token</label>
                <Input
                  placeholder="123456789:ABCdef..."
                  value={botForm.botToken}
                  onChange={(e) => setBotForm({ ...botForm, botToken: e.target.value })}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Get from @BotFather on Telegram</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Notification Chat ID
                </label>
                <Input
                  placeholder="-1001234567890 or your user ID"
                  value={botForm.notificationChatId}
                  onChange={(e) => setBotForm({ ...botForm, notificationChatId: e.target.value })}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your Telegram user ID, or a group/channel ID
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setBotEditing(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveBot} disabled={botSaving}>
                  {botSaving ? "Saving..." : "Save"}
                </Button>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 text-xs text-muted-foreground space-y-1.5">
                <p className="font-medium text-foreground">How to get your Chat ID:</p>
                <p>1. Create a bot with @BotFather, copy the token</p>
                <p>2. Send any message to the bot (or add it to a group)</p>
                <p>3. Open in browser:</p>
                <p className="font-mono bg-background rounded px-2 py-1 break-all">
                  api.telegram.org/bot&lt;TOKEN&gt;/getUpdates
                </p>
                <p>4. Find "chat" → "id" in the response</p>
              </div>
            </div>
          )}
        </div>

        {/* Commission Tiers */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Percent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Commission Tiers</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Custom rates by order size</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setAddingTier(!addingTier)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {addingTier && (
            <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border animate-in fade-in">
              <h3 className="text-sm font-medium">New Tier</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Min (USDT)</label>
                  <Input
                    placeholder="0"
                    type="number"
                    value={newTier.minOrderAmount}
                    onChange={(e) => setNewTier({ ...newTier, minOrderAmount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Max (USDT)</label>
                  <Input
                    placeholder="No limit"
                    type="number"
                    value={newTier.maxOrderAmount}
                    onChange={(e) => setNewTier({ ...newTier, maxOrderAmount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Commission %</label>
                <Input
                  placeholder="e.g. 3.5"
                  type="number"
                  step="0.1"
                  value={newTier.commissionPercent}
                  onChange={(e) => setNewTier({ ...newTier, commissionPercent: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setAddingTier(false)}>
                  Cancel
                </Button>
                <Button size="sm" className="flex-1" onClick={handleAddTier}>
                  Add Tier
                </Button>
              </div>
            </div>
          )}

          {tiersLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
            </div>
          ) : shopTiers.length === 0 && platformTiers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm space-y-1">
              <p>No tiers configured.</p>
              <p className="text-xs">Platform default (5%) applies to all orders.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {platformTiers.length > 0 && (
                <p className="text-xs font-medium text-muted-foreground pt-1">Platform defaults</p>
              )}
              {platformTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20"
                >
                  <span className="text-sm">
                    {formatPrice(tier.minOrderAmount)}
                    {tier.maxOrderAmount ? ` – ${formatPrice(tier.maxOrderAmount)}` : "+"} USDT
                  </span>
                  <span className="text-primary font-bold text-sm">{tier.commissionPercent}%</span>
                </div>
              ))}

              {shopTiers.length > 0 && (
                <p className="text-xs font-medium text-muted-foreground pt-1">Your custom tiers</p>
              )}
              {shopTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-opacity ${
                    tier.isActive ? "border-primary/30 bg-primary/5" : "border-border opacity-50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">
                      {formatPrice(tier.minOrderAmount)}
                      {tier.maxOrderAmount ? ` – ${formatPrice(tier.maxOrderAmount)}` : "+"} USDT
                    </span>
                    {!tier.isActive && (
                      <span className="ml-2 text-xs text-muted-foreground">(inactive)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold text-sm">{tier.commissionPercent}%</span>
                    <button
                      onClick={() => handleToggleTier(tier)}
                      className="text-xs text-muted-foreground hover:text-foreground underline"
                    >
                      {tier.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => handleDeleteTier(tier.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-muted/30 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">How tiers work:</p>
            <p>Lower orders → lower commission. Higher orders → higher commission.</p>
            <p>Your custom tiers override the platform defaults for your shop.</p>
            <p>Example: 0–50 USDT = 3% / 50–200 USDT = 4% / 200+ USDT = 5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
