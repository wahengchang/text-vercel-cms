import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  getAdminCredentials,
  getSessionCookieName,
  getSessionToken,
} from "../lib/auth";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

async function handleLogin(formData: FormData) {
  "use server";

  const { email: adminEmail, password: adminPassword } = getAdminCredentials();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const emailMatches = adminEmail ? email === adminEmail.toLowerCase() : true;
  const passwordMatches = password === adminPassword;

  if (!emailMatches || !passwordMatches) {
    redirect("/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), getSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams;
  const showError = resolvedParams?.error === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-16 text-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Admin Access
          </p>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-zinc-600">
            Use your credentials to access the admin welcome screen.
          </p>
        </div>
        <form action={handleLogin} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-zinc-700">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="admin@example.com"
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm shadow-sm focus:border-zinc-400 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm shadow-sm focus:border-zinc-400 focus:outline-none"
            />
          </label>
          {showError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              Invalid email or password.
            </p>
          ) : null}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-zinc-600">
              <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" />
              Remember me
            </label>
            <button
              type="button"
              className="text-sm font-medium text-zinc-900 hover:text-zinc-600"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-xs text-zinc-500">
          Demo only. Implement real authentication before production use.
        </p>
        <div className="mt-4 text-sm text-zinc-600">
          <Link className="font-medium text-zinc-900 hover:text-zinc-600" href="/">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
