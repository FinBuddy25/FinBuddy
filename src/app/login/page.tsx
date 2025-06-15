"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { MagicCard } from "@/components/ui/magic-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Mail, Lock, Shield, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Signup functionality temporarily disabled for MVP demo
  // Uncomment this function to re-enable signup
  /*
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      setError('Check your email for the confirmation link')
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }
  */

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <RetroGrid
          angle={75}
          cellSize={40}
          opacity={0.3}
          lightLineColor="rgba(59, 130, 246, 0.2)"
          darkLineColor="rgba(59, 130, 246, 0.3)"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/10" />

      <div className="z-10 mb-8 flex items-center space-x-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <CreditCard className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          FinBuddy
        </h2>
      </div>

      <MagicCard
        className="z-10 w-full max-w-md overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
        hover={false}
      >
        <div className="space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome to FinBuddy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account
            </p>
          </div>

          <form className="space-y-5">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="name@example.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="pt-2">
              <ShimmerButton
                type="submit"
                onClick={handleSignIn}
                disabled={loading}
                className="w-full py-2.5 font-medium shadow-md"
                shimmerColor="var(--shimmer-to)"
                shimmerSize="0.03em"
                shimmerDuration="2.5s"
                background="var(--primary)"
              >
                {loading ? "Loading..." : "Sign In"}
              </ShimmerButton>
            </div>
          </form>
        </div>
      </MagicCard>

      <div className="z-10 mt-6 flex items-center justify-center space-x-2 text-center text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <p>Secure financial management for your business</p>
      </div>
    </div>
  );
}
