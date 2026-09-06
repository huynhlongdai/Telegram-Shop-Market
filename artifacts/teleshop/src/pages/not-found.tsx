import { Link } from "wouter";
import { AlertCircle, ArrowLeft } from "lucide-react";
export default function NotFound() {
  return <div className="grid min-h-[100dvh] place-items-center px-5"><div className="w-full max-w-sm"><span className="grid h-12 w-12 place-items-center rounded-lg border border-red-400/20 bg-red-400/[0.06] text-red-300"><AlertCircle className="h-5 w-5" /></span><p className="eyebrow mb-3 mt-6">Navigation error · 404</p><h1 className="text-[30px] font-semibold tracking-[-0.045em]">This route does not exist.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">The page may have moved, or the link may be incomplete.</p><Link href="/" className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-mono text-xs font-bold uppercase tracking-[0.08em] text-primary-foreground"><ArrowLeft className="h-4 w-4" />Return home</Link></div></div>;
}
