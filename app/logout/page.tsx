import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSessionCookieName } from "../lib/auth";

export default async function LogoutPage() {
  const cookieStore = await cookies();
  cookieStore.delete(getSessionCookieName());
  redirect("/login");
}
