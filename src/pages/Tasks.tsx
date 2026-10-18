
import type { ChallengeTask } from "../types";
import DailyChecklist from "../components/DailyChecklist";

type TasksProps = {
  tasks: ChallengeTask[];
  onToggleTask: (id: string) => void;
};

export default function Tasks({ tasks, onToggleTask }: TasksProps) {
  return (
    <section className="panel simple-page">
      <p className="eyebrow accent-text">DAILY EXECUTION</p>
      <h1>Your tasks</h1>
      <p className="welcome-copy">Track every commitment for today.</p>
      <DailyChecklist tasks={tasks} onToggle={onToggleTask} />
    </section>
  );
}
