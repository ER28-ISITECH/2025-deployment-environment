import axios from 'axios';
import type {CreateTaskRequest, UpdateTaskRequest} from "../types/task.ts";

const api = axios.create({
  baseURL: 'http://localhost:3001/api/tasks',
});

export const getTodos = async () => {
  const response = await api.get('');
  return response.data;
};

export const createTodo = async (todo: CreateTaskRequest) => {
  const response = await api.post('', todo);
  return response.data;
};

export const updateTodo = async ({
  id,
  task
}: {
  id: string;
  task: UpdateTaskRequest
}) => {
  const response = await api.patch(`/${id}`, task);
  return response.data;
};

export const deleteTodo = async (id: string) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
