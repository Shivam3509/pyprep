import { Sidebar, Header } from "@/components/layout/Sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="platform-main">
        {children}
      </div>
    </div>
  );
}
