import { Link } from "react-router-dom";
import type { Task } from "../../types/taskTypes";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <Link to={`/tasks/${task.id}`} className="task-card">
      <div className="task-card-head">
        <h3 className="task-card-title">{task.title}</h3>
        <div className="task-card-badges">
          <span
            className={`badge badge-priority badge-priority-${task.priority.toLowerCase()}`}
          >
            {task.priority}
          </span>
          <span
            className={`badge badge-status badge-status-${task.status.toLowerCase()}`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      {task.tags.length > 0 && (
        <div className="task-card-tags">
          {task.tags.map((tag) => (
            <span key={tag.id} className="tag-chip">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="task-card-meta">
        <span>by {task.creator.nickname}</span>
        {task.assignee && <span>→ {task.assignee.nickname}</span>}
        <span className="task-card-date">
          {new Date(task.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}