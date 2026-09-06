import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Send, ShieldCheck, Users, Info, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useGetMyAffiliate, useEnrollAffiliate } from "@workspace/api-client-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

async function apiFetch(path: string, token: string, options: RequestInit = {}) {
  const response = await fetch(`/api${path}`, { ...options, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(options.headers ?? {}) } });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body;
}

export default function KolOnboardingPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { data: affiliate, isLoading, refetch } = useGetMyAffiliate();
  const { mutate: enroll, isPending } = useEnrollAffiliate();
  const [channel, setChannel] = useState("");
  const { data: application } = useQuery({ queryKey: ["kol-application"], queryFn: () => apiFetch("/affiliates/me/kol", token!), enabled: !!token && !!affiliate, retry: false });
  const { mutate: submit, isPending: submitting } = useMutation({
    mutationFn: () => apiFetch("/affiliates/me/kol", token!, { method: "POST", body: JSON.stringify({ channelUsername: channel }) }),
    onSuccess: () => { toast({ title: "Creator application submitted", description: "An admin can now review the channel." }); queryClient.invalidateQueries({ queryKey: ["kol-application"] }); },
    onError: (error: Error) => toast({ title: "Could not submit application", description: error.message, variant: "destructive" }),
  });
  const activateAffiliate = () => enroll(undefined, { onSuccess: () => { toast({ title: "Affiliate account activated" }); refetch(); }, onError: (error: Error) => toast({ title: "Could not activate account", description: error.message, variant: "destructive" }) });

  if (isLoading) return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>;
  const status = application?.status || "not_applied";

  return <div className="pb-8"><div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3"><Link href="/affiliate" className="grid h-11 w-11 place-items-center rounded-lg border border-white/[0.09] bg-card"><ArrowLeft className="h-4 w-4" /></Link><div><p className="eyebrow mb-1">Partner program</p><p className="text-sm font-medium">Creator onboarding</p></div></div><div className="space-y-6 px-4 py-5"><section><span className="grid h-12 w-12 place-items-center rounded-lg border border-primary/20 bg-primary/[0.06] text-primary"><Users className="h-5 w-5" /></span><h1 className="mt-5 text-[28px] font-semibold leading-[1.08] tracking-[-0.04em]">Connect your audience to verified offers.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Submit a public Telegram channel for manual ownership, audience, and policy review.</p></section><section className="app-surface overflow-hidden"><div className="border-b border-white/[0.07] p-4"><p className="eyebrow mb-2">Affiliate prerequisite</p><div className="flex items-center justify-between"><p className="text-sm font-medium">Distribution account</p><span className={`rounded-md border px-2 py-1 font-mono text-[9px] uppercase ${affiliate ? "border-primary/20 text-primary" : "border-amber-400/20 text-amber-300"}`}>{affiliate ? affiliate.status : "Required"}</span></div></div>{!affiliate && <div className="p-4"><button onClick={activateAffiliate} disabled={isPending} className="min-h-11 w-full rounded-lg bg-primary font-mono text-xs font-bold uppercase text-primary-foreground">{isPending ? "Activating…" : "Activate affiliate account"}</button></div>}</section>{application && status !== "not_applied" ? <section className="app-surface p-4"><div className="flex items-start gap-3"><CheckCircle2 className={`mt-0.5 h-5 w-5 ${status === "approved" ? "text-primary" : status === "rejected" ? "text-red-300" : "text-amber-300"}`} /><div><p className="text-sm font-medium capitalize">Application {status}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{application.channelUsername}</p>{application.reviewNote && <p className="mt-3 text-xs leading-5 text-muted-foreground">{application.reviewNote}</p>}</div></div></section> : <section><p className="eyebrow mb-3">Channel submission</p><div className="app-surface space-y-4 p-4"><label className="block"><span className="eyebrow mb-2 block">Telegram channel username</span><div className="flex h-12 items-center gap-3 rounded-lg border border-white/[0.09] bg-[#0d1015] px-3"><Send className="h-4 w-4 text-muted-foreground" /><input value={channel} onChange={(event) => setChannel(event.target.value)} placeholder="@channel" className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none" /></div></label><div className="space-y-3 border-t border-white/[0.07] pt-4"><Requirement text="Channel must be public and accessible to reviewers" /><Requirement text="Reviewer checks ownership, activity, and policy compliance" /><Requirement text="Decision and reviewer note are stored on your affiliate profile" /></div><button onClick={() => submit()} disabled={!affiliate || !/^@[A-Za-z0-9_]{5,32}$/.test(channel) || submitting} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-mono text-xs font-bold uppercase text-primary-foreground disabled:opacity-40">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Submit for review <ArrowRight className="h-4 w-4" /></>}</button><div className="flex gap-2 text-[10px] leading-4 text-muted-foreground"><Info className="h-3.5 w-3.5 shrink-0 text-amber-300" />Submission does not automatically grant KOL status. An admin decision is required.</div></div></section>}</div></div>;
}

function Requirement({ text }: { text: string }) { return <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{text}</div>; }
