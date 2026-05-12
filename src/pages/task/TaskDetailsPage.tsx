import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteTask,
  fetchTaskById,
  updateTask,
} from "../../features/task/taskThunks";
import { clearSelected } from "../../features/task/taskSlice";
import { fetchUsers } from "../../features/user/userThunks";
import Modal from "../../components/task/Modal";
import TaskForm from "../../components/task/TaskForm";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../../dto/taskDtos";
import type { User } from "../../types/authTypes";

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected, selectedLoading, selectedError } = useAppSelector(
    (state) => state.task,
  );
  const { users: allUsers, loading: usersLoading } = useAppSelector(
    (state) => state.user,
  );

  const [editOpen, setEditOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deletingError, setDeletingError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchTaskById(id));
    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (allUsers.length === 0 && !usersLoading) {
      dispatch(fetchUsers());
    }
  }, [dispatch, allUsers.length, usersLoading]);

  const usersById = useMemo(() => {
    const map = new Map<string, User>();
    for (const u of allUsers) map.set(u.id, u);
    return map;
  }, [allUsers]);

  function displayUser(userId: string): string {
    const u = usersById.get(userId);
    return u ? u.nickname : userId;
  }

  async function handleUpdate(
    values: CreateTaskRequest | UpdateTaskRequest,
  ): Promise<boolean> {
    if (!id) return false;
    setEditError(null);
    const result = await dispatch(
      updateTask({ id, changes: values as UpdateTaskRequest }),
    );
    if (updateTask.fulfilled.match(result)) {
      setEditOpen(false);
      return true;
    }
    setEditError(
      typeof result.payload === "string" ? result.payload : "Failed to update task",
    );
    return false;
  }

  async function handleDelete() {
    if (!id) return;
    setDeletingError(null);
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) {
      navigate("/tasks", { replace: true });
      return;
    }
    setDeletingError(
      typeof result.payload === "string" ? result.payload : "Failed to delete task",
    );
    setConfirmDelete(false);
  }

  if (selectedLoading && !selected) {
    return (
      <div className="tasks-page">
        <div className="tasks-status">Loading task...</div>
      </div>
    );
  }

  if (selectedError && !selected) {
    return (
      <div className="tasks-page">
        <p className="tasks-error">
          <span>{selectedError}</span>
        </p>
        <Link to="/tasks" className="back-link">← Back to tasks</Link>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="tasks-page">
        <div className="tasks-status">Task not found.</div>
        <Link to="/tasks" className="back-link">← Back to tasks</Link>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <Link to="/tasks" className="back-link">← Back to tasks</Link>

      <header className="tasks-header">
        <div>
          <h1 className="tasks-title">{selected.title}</h1>
          <p className="tasks-subtitle">ID: {selected.id}</p>
          <div className="task-card-badges" style={{ marginTop: 8 }}>
            <span
              className={`badge badge-priority badge-priority-${selected.priority.toLowerCase()}`}
            >
              {selected.priority}
            </span>
            <span
              className={`badge badge-status badge-status-${selected.status.toLowerCase()}`}
            >
              {selected.status.replace("_", " ")}
            </span>
            <span className="badge badge-status badge-status-todo">
              {selected.visibility}
            </span>
          </div>
        </div>
        <div className="tasks-actions">
          <button
            className="pagination-btn"
            type="button"
            onClick={() => {
              setEditError(null);
              setEditOpen(true);
            }}
            disabled={selectedLoading}
          >
            Edit
          </button>
          <button
            className="pagination-btn pagination-btn-danger"
            type="button"
            onClick={() => {
              setDeletingError(null);
              setConfirmDelete(true);
            }}
            disabled={selectedLoading}
          >
            Delete
          </button>
        </div>
      </header>

      {selectedError && selected && (
        <div className="tasks-error">
          <span>{selectedError}</span>
        </div>
      )}

      {selected.description && (
        <section className="task-detail-section">
          <h3>Description</h3>
          <p className="task-detail-desc">{selected.description}</p>
        </section>
      )}

      {selected.tags.length > 0 && (
        <section className="task-detail-section">
          <h3>Tags</h3>
          <div className="task-card-tags">
            {selected.tags.map((tag) => (
              <span key={tag.id} className="tag-chip">#{tag.name}</span>
            ))}
          </div>
        </section>
      )}

      <section className="task-detail-section">
        <h3>People</h3>
        <dl className="task-detail-meta">
          <dt>Created by</dt>
          <dd>
            {selected.creator.nickname}
            {selected.creator.email && (
              <span className="task-detail-secondary"> · {selected.creator.email}</span>
            )}
          </dd>

          <dt>Assignee</dt>
          <dd>
            {selected.assignee ? (
              <>
                {selected.assignee.nickname}
                {selected.assignee.email && (
                  <span className="task-detail-secondary"> · {selected.assignee.email}</span>
                )}
                <span
                  className={`badge badge-status badge-status-${selected.assignmentStatus.toLowerCase()}`}
                  style={{ marginLeft: 8 }}
                >
                  {selected.assignmentStatus}
                </span>
              </>
            ) : (
              "—"
            )}
          </dd>

          {selected.assignedById && (
            <>
              <dt>Assigned by</dt>
              <dd>{displayUser(selected.assignedById)}</dd>
            </>
          )}
        </dl>
      </section>

      <section className="task-detail-section">
        <h3>Viewers</h3>
        {selected.viewerUserIds.length === 0 ? (
          <p className="task-detail-secondary">No viewers configured.</p>
        ) : (
          <div className="task-card-tags">
            {selected.viewerUserIds.map((viewerId) => (
              <span key={viewerId} className="tag-chip">
                {displayUser(viewerId)}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="task-detail-section">
        <h3>Timestamps</h3>
        <dl className="task-detail-meta">
          <dt>Created</dt>
          <dd>{new Date(selected.createdAt).toLocaleString()}</dd>
          <dt>Updated</dt>
          <dd>{new Date(selected.updatedAt).toLocaleString()}</dd>
        </dl>
      </section>

      <Modal
        open={editOpen}
        title="Edit task"
        onClose={() => setEditOpen(false)}
      >
        <TaskForm
          mode="edit"
          initial={selected}
          error={editError}
          submitting={selectedLoading}
          onSubmit={handleUpdate}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <Modal
        open={confirmDelete}
        title="Delete task?"
        onClose={() => setConfirmDelete(false)}
      >
        <p>This will permanently delete "<strong>{selected.title}</strong>". This action cannot be undone.</p>
        {deletingError && <p className="form-input-error">{deletingError}</p>}
        <div className="form-actions">
          <button
            type="button"
            className="pagination-btn"
            onClick={() => setConfirmDelete(false)}
            disabled={selectedLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="form-submit-btn form-submit-btn-inline form-submit-btn-danger"
            onClick={handleDelete}
            disabled={selectedLoading}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
