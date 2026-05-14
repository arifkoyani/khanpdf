"use client"
import { useState, type FormEvent } from "react";
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useRouter } from "next/navigation";


 export default function AdminLogin() {
    const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/blog-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Store session
      sessionStorage.setItem("blog_admin_session", "1");
      sessionStorage.setItem("blog_admin_email", email);
      router.push("/blog/admin");
    } catch {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl" />
        <div
          className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-10 md:grid-cols-2 md:gap-16">
          {/* Left: brand / motto */}
          <div className="hidden flex-col justify-between md:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Blog Content Studio
              </div>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight leading-[1.05]">
                Write less.
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Publish bolder.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                A calm, focused workspace for crafting meaningful stories — draft, refine, and ship
                long-form content with intention.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {[
                { t: "Distraction-free editor", d: "Pure writing surface, zero clutter." },
                { t: "Drag & drop media", d: "Place images and video exactly where they belong." },
                { t: "Draft → Publish flow", d: "Save iterations, ship when ready." },
              ].map((f, i) => (
                <div
                  key={f.t}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{f.t}</div>
                    <div className="text-xs text-muted-foreground">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form card */}
          <div className="flex items-center">
            <div className="w-full rounded-2xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">Admin Sign In</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Enter your credentials to access the studio.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@yourdomain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 pl-9 transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pl-9 pr-10 transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4" />
                      Signing in…
                    </>
                  ) : (
                    "Sign In to Studio"
                  )}
                </Button>

                <p className="pt-2 text-center text-xs text-muted-foreground">
                  Protected area · Authorized personnel only
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
