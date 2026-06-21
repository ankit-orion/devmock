import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const metadata = { title: "Dashboard" };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <DashboardSidebar />
      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
