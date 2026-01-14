import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSessionCookieName, getSessionToken } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export default async function AdminPostsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(getSessionCookieName())?.value;

  if (sessionToken !== getSessionToken()) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-50">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
            Admin Posts
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Posts</h1>
              <p className="text-sm text-zinc-400">
                Basic CMS list pulled from Prisma.
              </p>
            </div>
            <Link
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
              href="/admin/posts/new"
            >
              New Post
            </Link>
          </div>
        </header>
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
          {posts.length === 0 ? (
            <p className="p-6 text-sm text-zinc-400">
              No posts yet. Seed the database or create one in the CMS.
            </p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {post.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        post.published
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-amber-500/20 text-amber-200"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <Link
                      className="rounded-full border border-zinc-700 px-4 py-1.5 text-xs font-semibold text-zinc-100 hover:border-zinc-500"
                      href={`/admin/posts/${post.id}`}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
