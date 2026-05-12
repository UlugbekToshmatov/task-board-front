import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createTask,
  fetchTasks,
} from "../../features/task/taskThunks";
import { clearError } from "../../features/task/taskSlice";
import { logout } from "../../features/auth/authSlice";
import TaskCard from "./TaskCard";
import Modal from "../../components/task/Modal";
import TaskForm from "../../components/task/TaskForm";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../../dto/taskDtos";

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const { items, total, page, pageSize, loading, error } = useAppSelector(
    (state) => state.task,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasks({ page: 1, pageSize: 20 }));
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const isRefreshing = loading && items.length > 0;

  function goToPage(next: number) {
    if (next < 1 || next > totalPages || next === page || loading) return;
    dispatch(fetchTasks({ page: next, pageSize }));
  }

  async function handleCreate(
    values: CreateTaskRequest | UpdateTaskRequest,
  ): Promise<boolean> {
    setCreateError(null);
    const result = await dispatch(createTask(values as CreateTaskRequest));
    if (createTask.fulfilled.match(result)) {
      setCreateOpen(false);
      return true;
    }
    setCreateError(
      typeof result.payload === "string" ? result.payload : "Failed to create task",
    );
    return false;
  }

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <div>
          <h1 className="tasks-title">Tasks</h1>
          <p className="tasks-subtitle">
            {loading && items.length === 0
              ? "Loading..."
              : `${total} task${total === 1 ? "" : "s"} total${
                  isRefreshing ? " · refreshing..." : ""
                }`}
          </p>
        </div>
        <div className="tasks-actions">
          <button
            className="form-submit-btn form-submit-btn-inline"
            type="button"
            onClick={() => {
              setCreateError(null);
              setCreateOpen(true);
            }}
          >
            + New Task
          </button>
          <button
            className="pagination-btn"
            type="button"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="tasks-error">
          <span>{error}</span>
          <button
            className="pagination-btn"
            type="button"
            onClick={() => dispatch(fetchTasks({ page, pageSize }))}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      {loading && items.length === 0 && !error && (
        <div className="tasks-status">Loading tasks...</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="tasks-status tasks-empty">
          <p>No tasks yet.</p>
        </div>
      )}

      {items.length > 0 && (
        <ul className={`task-list${isRefreshing ? " task-list-stale" : ""}`}>
          {items.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Tasks pagination">
          <button
            className="pagination-btn"
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || loading}
          >
            Prev
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </nav>
      )}

      <Modal
        open={createOpen}
        title="New task"
        onClose={() => setCreateOpen(false)}
      >
        <TaskForm
          mode="create"
          error={createError}
          submitting={loading}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>
    </div>
  );
}
