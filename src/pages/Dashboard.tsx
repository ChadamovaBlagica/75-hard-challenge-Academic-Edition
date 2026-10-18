
import { ArrowRight, Flame, Target } from "lucide-react";
import DailyChecklist from "../components/DailyChecklist";
import ProgressRing from "../components/ProgressRing";
import StatCard from "../components/StatCard";
import type { ChallengeTask } from "../types";

type DashboardProps = {
  dayNumber: number;
  completedCount: number;
  totalTasks: number;
  progress: number;
  tasks: ChallengeTask[];
  reflection: string;
  onToggleTask: (id: string) => void;
  onReflectionChange: (value: string) => void;
  onOpenChallenge: () => void;
};

export default function Dashboard({
  dayNumber,
  completedCount,
  totalTasks,
  progress,
  tasks,
  reflection,
  onToggleTask,
  onReflectionChange,
  onOpenChallenge,
}: DashboardProps) {
  const allComplete = completedCount === totalTasks;

  return (
    <div className="dashboard-page">
      <section className="welcome-row">
        <div>
          <p className="eyebrow accent-text">YOUR JOURNEY, DAY {dayNumber}</p>
          <h1>Make today <em>count.</em></h1>
          <p className="welcome-copy">
            You don't need a perfect day. You need to keep the promises you make to yourself.
          </p>
        </div>
        <button className="primary-button" onClick={onOpenChallenge}>
          View challenge <ArrowRight size={17} />
        </button>
      </section>

      <section className="stat-grid" aria-label="Your statistics">
        <StatCard
          label="CHALLENGE DAY"
          value={`${dayNumber} / 75`}
          detail={`${Math.max(0, 75 - dayNumber)} days remaining`}
        />
        <StatCard
          label="TODAY'S PROGRESS"
          value={`${progress}%`}
          detail={`${completedCount} of ${totalTasks} tasks completed`}
        />
        <StatCard
          label="DAILY STANDARD"
          value={allComplete ? "Achieved" : "In progress"}
          detail={allComplete ? "You completed every task." : "Keep moving forward."}
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel checklist-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">DAILY EXECUTION</p>
              <h2>Today's commitments</h2>
              <p className="muted">Keep the promises you made to yourself.</p>
            </div>
            <span className="date-chip">{completedCount}/{totalTasks}</span>
          </div>

          <DailyChecklist tasks={tasks} onToggle={onToggleTask} />

          {allComplete && (
            <div className="success-message">
              <Flame size={18} />
              All commitments completed. Excellent work.
            </div>
          )}
        </article>

        <div className="right-column">
          <article className="panel progress-panel">
            <p className="eyebrow">THE BIG PICTURE</p>
            <h2>Your consistency</h2>
            <div className="ring-wrap">
              <ProgressRing progress={progress} size={142} />
            </div>
            <p className="progress-caption">
              {allComplete
                ? "You showed up for yourself today."
                : "Every completed task is a vote for the person you're becoming."}
            </p>
            <div className="progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>
          </article>

          <article className="panel reflection-panel">
            <div className="reflection-title">
              <Target size={18} />
              <h2>Daily reflection</h2>
            </div>
            <p className="muted">What did you learn today?</p>
            <textarea
              value={reflection}
              onChange={(event) => onReflectionChange(event.target.value)}
              placeholder="One thing I understood better today was..."
              rows={4}
            />
            <p className="reflection-footnote">Your reflection is saved in this browser.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
