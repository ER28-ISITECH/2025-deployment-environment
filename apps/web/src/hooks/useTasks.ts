import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todo-api.ts';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation(createTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const updateTaskMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const deleteTaskMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });


  return {
    todos: useQuery('todos', getTodos),
    createTask: createTaskMutation,
    updateTask: updateTaskMutation,
    deleteTask: deleteTaskMutation,
  };
};
