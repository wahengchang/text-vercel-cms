import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getSessionCookieName, getSessionToken } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(getSessionCookieName())?.value;

  if (sessionToken !== getSessionToken()) {
    redirect("/login");
  }
}

async function handleUpdate(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!id || !title || !content) {
    redirect(`/admin/posts/${id}?error=missing`);
  }

  const slug = slugInput ? slugify(slugInput) : slugify(title);
  if (!slug) {
    redirect(`/admin/posts/${id}?error=slug`);
  }

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    redirect(`/admin/posts/${id}?error=slug`);
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      coverImage: coverImage || null,
      published,
    },
  });

  redirect(`/admin/posts/${id}`);
}

export default async function EditPostPage({
  params,
  searchParams,
}: EditPostPageProps) {
  await requireAdmin();
  const { id } = await params;
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error;

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
            Admin Posts
          </p>
          <h1 className="text-3xl font-semibold">Edit post</h1>
          <p className="text-sm text-zinc-400">
            Update fields and save changes.
          </p>
        </header>
        <form
          action={handleUpdate}
          className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <input type="hidden" name="id" value={post.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-zinc-200">
              Title
              <input
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
                name="title"
                defaultValue={post.title}
                required
              />
            </label>
            <label className="text-sm font-semibold text-zinc-200">
              Slug
              <input
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
                name="slug"
                defaultValue={post.slug}
              />
            </label>
          </div>
          <label className="text-sm font-semibold text-zinc-200">
            Cover image URL
            <input
              className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
              name="coverImage"
              defaultValue={post.coverImage ?? ""}
              placeholder="https://..."
            />
          </label>
          <label className="text-sm font-semibold text-zinc-200">
            Content
            <textarea
              className="mt-2 min-h-[180px] w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
              name="content"
              defaultValue={post.content}
              required
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              name="published"
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950"
              defaultChecked={post.published}
            />
            Published
          </label>
          {error ? (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error === "missing"
                ? "Title and content are required."
                : "Slug is invalid or already used."}
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              Save changes
            </button>
            <a
              className="rounded-full border border-zinc-700 px-5 py-2 text-center text-sm font-semibold text-zinc-100 hover:border-zinc-500"
              href="/admin/posts"
            >
              Back to list
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
