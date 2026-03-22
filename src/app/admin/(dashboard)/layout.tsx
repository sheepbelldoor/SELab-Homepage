import AdminSidebar from "@/components/AdminSidebar";
import SessionProvider from "@/components/SessionProvider";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 bg-gray-50">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
