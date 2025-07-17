export interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}
