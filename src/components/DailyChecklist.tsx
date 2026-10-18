
import type { ChallengeTask } from "../types";

type DailyChecklistProps = {
  tasks: ChallengeTask[];
  onToggle: (id: string) => void;
};

export default function DailyChecklist({
  tasks,
  onToggle,
}: DailyChecklistProps) {
  return (
    <div className="checklist">
      {tasks.map((task) => (
        <label className="task-row" key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span className={task.completed ? "task-copy is-complete" : "task-copy"}>
            <strong>{task.title}</strong>
            <span>{task.description}</span>
          </span>
          <span className={task.completed ? "task-status done" : "task-status"}>
            {task.completed ? "Done" : "To do"}
          </span>
        </label>
      ))}
    </div>
  );
}
