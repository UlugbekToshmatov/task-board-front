import type { TaskFilterParams } from "../../dto/taskDtos";

export function buildTaskQueryParams(params: TaskFilterParams): string {
  const queryParams = new URLSearchParams();
  queryParams.append("page", params.page.toString());
  queryParams.append("pageSize", params.pageSize.toString());

  // Append other filter parameters as needed
  if (params.status) {
    params.status.forEach((status) => queryParams.append("status", status));
  }
  if (params.priority) {
    params.priority.forEach((priority) =>
      queryParams.append("priority", priority),
    );
  }
  if (params.assignmentStatus) {
    params.assignmentStatus.forEach((status) =>
      queryParams.append("assignmentStatus", status),
    );
  }
  if (params.q) {
    queryParams.append("q", params.q);
  }
  if (params.tag) {
    params.tag.forEach((tag) => queryParams.append("tag", tag));
  }
  if (params.sort) {
    queryParams.append("sort", params.sort);
  }
  if (params.order) {
    queryParams.append("order", params.order);
  }
  if (params.mine) {
    queryParams.append("mine", params.mine);
  }
  
  return queryParams.toString();
}
