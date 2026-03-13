import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/layout/AppSidebar";

export function AppLayout() {
  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
