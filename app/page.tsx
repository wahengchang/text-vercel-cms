import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-zinc-950">
      <main className="flex w-full max-w-3xl flex-col gap-10 rounded-2xl border border-zinc-200 bg-white px-8 py-12 shadow-sm">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Text Next CLI
          </p>
          <h1 className="text-3xl font-semibold leading-tight">
            Start with authentication flows.
          </h1>
          <p className="text-base text-zinc-600">
            Use the login page for sign-in and the admin page as a protected
            destination.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            className="flex items-center justify-between rounded-xl border border-zinc-200 px-5 py-4 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
            href="/login"
          >
            Go to Login
            <span aria-hidden>→</span>
          </Link>
          <Link
            className="flex items-center justify-between rounded-xl border border-zinc-200 px-5 py-4 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
            href="/admin"
          >
            Admin Welcome
            <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
