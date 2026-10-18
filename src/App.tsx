
import { useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import type { PageName } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Challenge from "./pages/Challenge";
import Tasks from "./pages/Tasks";
import DailyExecution from "./pages/DailyExecution";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import { useChallenge } from "./hooks/useChallenge";
import StudyStreak from "./pages/StudyStreak";
import AcademicAnalytics from "./pages/AcademicAnalytics";
import WeeklyPlanner from "./pages/WeeklyPlanner";
import FocusTimer from "./pages/FocusTimer";




export default function App() {
  const [activePage, setActivePage] = useState<PageName>("Dashboard");
  const challenge = useChallenge();

  if (!challenge.started) {
    return (
      <div className="start-screen">
        <div className="start-card">
          <p className="start-eyebrow">75 DAYS. ONE COMMITMENT.</p>
          <h1>75 HARD</h1>
          <h2>Academic Edition</h2>

          <p className="start-description">
            Build consistency, strengthen your focus, and become the
            student you know you can be.
          </p>

          <div className="start-details">
            <div>
              <strong>75</strong>
              <span>days of growth</span>
            </div>
            <div>
              <strong>4</strong>
              <span>daily tasks</span>
            </div>
            <div>
              <strong>1</strong>
              <span>commitment to yourself</span>
            </div>
          </div>

          <button
            className="start-button"
            onClick={challenge.startChallenge}
          >
            Start Challenge
          </button>

          <p className="start-note">
            Your Day 1 begins today, when you press the button.
          </p>
        </div>
      </div>
    );
  }

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return (
          <Dashboard
            dayNumber={challenge.dayNumber}
            completedCount={challenge.completedCount}
            totalTasks={challenge.totalTasks}
            progress={challenge.progress}
            tasks={challenge.today.tasks}
            reflection={challenge.today.reflection}
            onToggleTask={challenge.toggleTask}
            onReflectionChange={challenge.updateReflection}
            onOpenChallenge={() => setActivePage("Challenge")}
          />
        );

      case "Challenge":
        return (
          <Challenge
            dayNumber={challenge.dayNumber}
            progress={challenge.progress}
          />
        );

      case "Tasks":
        return (
          <Tasks
            tasks={challenge.today.tasks}
            onToggleTask={challenge.toggleTask}
          />
        );

      case "Daily Execution":
        return <DailyExecution />;

      case "Study Streak":
        return <StudyStreak />; 
      
      case "Academic Analytics":
        return <AcademicAnalytics />;  

      case "Weekly Planner":
        return <WeeklyPlanner />; 
        
      case "Calendar":
        return <Calendar state={challenge.state} />;

      case "Focus Timer":
        return <FocusTimer />;  

      case "Settings":
        return <Settings />;

      default:
        return null;
    }
  }

  return (
    <DashboardLayout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
