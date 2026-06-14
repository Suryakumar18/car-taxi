import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdminRequest } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin — Site Manager",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdminRequest())) redirect("/admin/login");
  return <AdminDashboard />;
}
