import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSessionCookieName, getSessionToken } from "../lib/auth";

export default async function AdminWelcomePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(getSessionCookieName())?.value;

  if (sessionToken !== getSessionToken()) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-16 text-zinc-50">
      <div className="w-full max-w-3xl space-y-10 rounded-3xl border border-zinc-800 bg-zinc-900 px-8 py-12 shadow-xl">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
            Admin
          </p>
          <h1 className="text-3xl font-semibold">Welcome back.</h1>
          <p className="text-sm text-zinc-400">
            This is the authenticated landing space for administrators.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Active Sessions", value: "14" },
            { label: "Pending Reviews", value: "3" },
            { label: "System Status", value: "All clear" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4"
            >
              <p className="text-xs uppercase text-zinc-500">{item.label}</p>
              <p className="mt-3 text-lg font-semibold text-zinc-100">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950">
            View activity log
          </button>
          <button className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-100">
            Manage users
          </button>
          <Link
            className="rounded-full border border-zinc-700 px-5 py-2 text-center text-sm font-semibold text-zinc-100 hover:border-zinc-500"
            href="/logout"
          >
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
}
