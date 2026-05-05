import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_TOKEN_COOKIE } from "@/app/lib/adminSession";
import { verifyAdminJwtCompact } from "@/app/lib/adminAuthJwt";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function AdminDashboardLayout({ children }) {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value ?? null;
  if (!(await verifyAdminJwtCompact(token))) {
    redirect("/admin/login");
  }
  return children;
}
