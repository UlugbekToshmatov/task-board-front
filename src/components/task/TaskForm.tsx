import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers } from "../../features/user/userThunks";
import { createTaskSchema, type CreateTaskForm } from "../../schemas/taskSchema";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../../dto/taskDtos";
import type { Task, TaskPriority, TaskStatus, TaskVisibility } from "../../types/taskTypes";

interface TaskFormProps {
  mode: "create" | "edit";
  initial?: Task;
  error?: string | null;
  submitting?: boolean;
  onSubmit: (values: CreateTaskRequest | UpdateTaskRequest) => Promise<boolean>;
  onCancel: () => void;
}

function emptyToUndef<T extends string>(v: T | "" | undefined): T | undefined {
  return v === "" || v === undefined ? undefined : v;
}

export default function TaskForm({
  mode,
  initial,
  error,
  submitting,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const dispatch = useAppDispatch();
  const { users, loading: usersLoading, error: usersError } = useAppSelector(
    (state) => state.user,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      status: initial?.status ?? "",
      priority: initial?.priority ?? "",
      visibility: initial?.visibility ?? "",
      assigneeId: initial?.assignee?.id ?? "",
      viewerUserIds: initial?.viewerUserIds ?? [],
    },
  });

  useEffect(() => {
    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length, usersLoading]);

  async function handleFormSubmit(values: CreateTaskForm) {
    const viewers = values.viewerUserIds ?? [];

    if (mode === "edit") {
      const payload: UpdateTaskRequest = {
        title: values.title,
        description: emptyToUndef(values.description),
        status: emptyToUndef(values.status) as TaskStatus | undefined,
        priority: emptyToUndef(values.priority) as TaskPriority | undefined,
        visibility: emptyToUndef(values.visibility) as TaskVisibility | undefined,
        viewerUserIds: viewers,
      };
      await onSubmit(payload);
      return;
    }

    const payload: CreateTaskRequest = {
      title: values.title,
      description: emptyToUndef(values.description),
      status: emptyToUndef(values.status) as TaskStatus | undefined,
      priority: emptyToUndef(values.priority) as TaskPriority | undefined,
      visibility: emptyToUndef(values.visibility) as TaskVisibility | undefined,
      assigneeId: emptyToUndef(values.assigneeId),
      viewerUserIds: viewers.length > 0 ? viewers : undefined,
    };
    const ok = await onSubmit(payload);
    if (ok) reset();
  }

  const busy = submitting || isSubmitting;

  return (
    <form className="task-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="form-row">
        <label className="form-label" htmlFor="task-title">Title</label>
        <input
          id="task-title"
          {...register("title")}
          type="text"
          placeholder="Task title"
          className="form-input"
          autoFocus
        />
        {errors.title && <p className="form-input-error">{errors.title.message}</p>}
      </div>

      <div className="form-row">
        <label className="form-label" htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          {...register("description")}
          placeholder="Optional details..."
          className="form-input form-textarea"
          rows={4}
        />
        {errors.description && <p className="form-input-error">{errors.description.message}</p>}
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label className="form-label" htmlFor="task-status">Status</label>
          <select
            id="task-status"
            {...register("status")}
            className="form-input form-select"
          >
            <option value="">— default —</option>
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            {...register("priority")}
            className="form-input form-select"
          >
            <option value="">— default —</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="task-visibility">Visibility</label>
          <select
            id="task-visibility"
            {...register("visibility")}
            className="form-input form-select"
          >
            <option value="">— default —</option>
            <option value="ONLY_ME">Only me</option>
            <option value="LIST">Specific viewers</option>
            <option value="ANYONE">Anyone</option>
          </select>
        </div>

        {mode === "create" && (
          <div className="form-row">
            <label className="form-label" htmlFor="task-assignee">Assignee</label>
            <select
              id="task-assignee"
              {...register("assigneeId")}
              className="form-input form-select"
              disabled={usersLoading && users.length === 0}
            >
              <option value="">— none —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nickname}{u.email ? ` (${u.email})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="form-row">
        <label className="form-label">
          Viewers{" "}
          <span className="form-label-hint">
            {mode === "edit"
              ? "(select users who can view this task)"
              : "(optional — only used when visibility is \"Specific viewers\")"}
          </span>
        </label>

        {usersLoading && users.length === 0 ? (
          <p className="form-label-hint">Loading users...</p>
        ) : usersError && users.length === 0 ? (
          <p className="form-input-error">{usersError}</p>
        ) : users.length === 0 ? (
          <p className="form-label-hint">No users available.</p>
        ) : (
          <Controller
            name="viewerUserIds"
            control={control}
            render={({ field }) => {
              const selected = field.value ?? [];
              return (
                <div className="viewer-list" role="group" aria-label="Viewers">
                  {users.map((u) => {
                    const checked = selected.includes(u.id);
                    return (
                      <label key={u.id} className="viewer-option">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...selected, u.id]
                              : selected.filter((id) => id !== u.id);
                            field.onChange(next);
                          }}
                        />
                        <span className="viewer-option-name">{u.nickname}</span>
                        {u.email && (
                          <span className="viewer-option-email">{u.email}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              );
            }}
          />
        )}
      </div>

      {error && <p className="form-input-error">{error}</p>}

      <div className="form-actions">
        <button
          type="button"
          className="pagination-btn"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="form-submit-btn form-submit-btn-inline"
          disabled={busy}
        >
          {mode === "create" ? "Create task" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
