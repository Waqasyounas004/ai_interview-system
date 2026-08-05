import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl min-h-[calc(100vh-8rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
