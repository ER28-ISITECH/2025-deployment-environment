import { ActionBar, Button, Portal, Stack } from "@chakra-ui/react";
import { useState } from "preact/hooks";
import { useTasks } from "../hooks/useTasks.ts";
import type { Task } from "../types/task.ts";
import { TaskRow } from "./TaskRow.tsx";

export const TaskList = ({ todos }: { todos: Task[] }) => {
  const [selectedTask, setSelectedTask] = useState<Task[]>([]);

  const changeSelectedTask = (task: Task) => {
    if (selectedTask.includes(task)) {
      setSelectedTask(selectedTask.filter((t) => t !== task));
    } else {
      setSelectedTask([...selectedTask, task]);
    }
  };

  const { deleteTask } = useTasks();

  return (
    <>
      <Stack my={4}>
        {todos.map((todo) => (
          <TaskRow
            task={todo}
            handleSelect={() => changeSelectedTask(todo)}
            isSelected={selectedTask.includes(todo)}
          />
        ))}
      </Stack>
      <ActionBar.Root open={selectedTask.length > 0}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selectedTask.length} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button
                variant="outline"
                color={"red"}
                size="sm"
                onClick={() => {
                  selectedTask.forEach((task) => {
                    deleteTask.mutate(task._id);
                  });
                  setSelectedTask([]);
                }}
              >
                Delete
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
};
