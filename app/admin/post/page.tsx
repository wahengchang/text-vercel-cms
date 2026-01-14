import { redirect } from "next/navigation";

export default function AdminPostRedirectPage() {
  redirect("/admin/posts");
}
