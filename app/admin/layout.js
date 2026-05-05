import AdminChrome from "@/components/admin/AdminChrome";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default function AdminLayout({ children }) {
  return <AdminChrome>{children}</AdminChrome>;
}

