
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  CircleHelp,
  LayoutDashboard,
  Settings,
  Target,
  GraduationCap,
  Flame,
  BarChart3,
  CalendarClock,
  Timer,
} from "lucide-react";

export type PageName =
  | "Dashboard"
  | "Challenge"
  | "Tasks"
  | "Daily Execution"
  | "Study Streak"
  | "Academic Analytics"
  | "Weekly Planner"
  | "Focus Timer"
  | "Calendar"
  | "Settings";

type SidebarProps = {
  activePage: PageName;
  onNavigate: (page: PageName) => void;
};

const links = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Challenge", icon: Target },
  { label: "Tasks", icon: CheckSquare },
  { label: "Daily Execution", icon: GraduationCap },
  { label: "Study Streak", icon: Flame },
  { label: "Academic Analytics", icon: BarChart3 },
  { label: "Weekly Planner", icon: CalendarClock },
  { label: "Focus Timer", icon: Timer },
  { label: "Calendar", icon: CalendarDays },
  { label: "Settings", icon: Settings },
] as const;

export default function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">75</div>
        <div>
          <strong>ACADEMIC</strong>
          <span>HARD EDITION</span>
        </div>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <nav className="side-nav" aria-label="Main navigation">
        {links.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className={`nav-link ${
              activePage === label ? "active" : ""
            }`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-note-icon">
          <BookOpen size={18} />
        </div>

        <p className="sidebar-note-title">
          Small steps. Real discipline.
        </p>

        <p className="sidebar-note-copy">
          Build a system you can trust, one day at a time.
        </p>

        <div className="help-link">
          <CircleHelp size={15} />
          <span>Your journey, your rules.</span>
        </div>
      </div>
    </aside>
  );
}
