
import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";
import Sidebar, { type PageName } from "../components/Sidebar";
import { formatLongDate } from "../utils/dates";

type DashboardLayoutProps = {
  activePage: PageName;
  onNavigate: (page: PageName) => void;
  children: ReactNode;
};

export default function DashboardLayout({
  activePage,
  onNavigate,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="topbar-date">{formatLongDate(new Date())}</p>
            <p className="topbar-subtitle">Your academic command center</p>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Search">
              <Search size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="avatar" aria-label="Your profile">S</div>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
