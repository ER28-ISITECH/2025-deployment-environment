import {
  Box,
  Button,
  Checkbox,
  Collapsible,
  createListCollection,
  Flex,
  Input,
  Portal,
  Select,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "preact/hooks";
import { useTasks } from "../hooks/useTasks.ts";
import type { Task } from "../types/task.ts";

export const TaskRow = ({
  task,
  handleSelect,
  isSelected,
}: {
  task: Task;
  handleSelect: () => void;
  isSelected: boolean;
}) => {
  const { updateTask } = useTasks();
  const { open, onToggle } = useDisclosure();
  const [statusValue, setStatusValue] = useState<string[]>([task.status]);
  const [editTask, setEditTask] = useState<Task>(task);

  const statusCollection = createListCollection({
    items: [
      { value: "pending", label: "Pending" },
      { value: "in-progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
  });

  const handleStatusChange = (value: string[]) => {
    const updatedTask = { ...editTask, status: value[0] as Task["status"] };
    setEditTask(updatedTask);
    setStatusValue(value);
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setEditTask({ ...editTask, [name]: value });
  };

  const handleUpdateTask = () => {
    updateTask.mutate({
      id: task._id,
      task: editTask,
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      justifyContent="space-between"
      alignItems="center"
      padding="10px"
      shadow="md"
      borderRadius="md"
      borderWidth="1px"
      cursor="pointer"
      _hover={{ backgroundColor: "gray.100" }}
    >
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Box>
          <Checkbox.Root
            onCheckedChange={() => handleSelect()}
            checked={isSelected}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>
        </Box>
        <Box flex="1" fontWeight="bold">
          {task.title}
        </Box>
        <Box flex="1" textAlign="center">
          {task.priority === "high" ? (
            <Box color="red.500" ml={2}>
              High
            </Box>
          ) : task.priority === "medium" ? (
            <Box color="yellow.500" ml={2}>
              Medium
            </Box>
          ) : (
            <Box color="green.500" ml={2}>
              Low
            </Box>
          )}
        </Box>
        <Box
          flex="1"
          textAlign="center"
          borderColor={
            task.status === "pending"
              ? "red.500"
              : task.status === "in-progress"
                ? "yellow.500"
                : "green.500"
          }
          borderWidth="1px"
          borderRadius="md"
        >
          <Select.Root
            collection={statusCollection}
            size="sm"
            value={statusValue}
            onValueChange={(e) => handleStatusChange(e.value)}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select status" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {statusCollection.items.map((framework) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>
        <Box>
          <Button onClick={onToggle} colorScheme="blue" size="sm" ml={2}>
            {open ? "Close" : "Show Details"}
          </Button>
        </Box>
      </Flex>
      <Collapsible.Root open={open} onOpenChange={onToggle} width="100%">
        <Collapsible.Content>
          <Box p={4} display="flex" flexDirection="column" gap={4} width="100%">
            <Input
              name="title"
              value={editTask.title}
              onChange={handleInputChange}
              placeholder="Title"
            />
            <Textarea
              name="description"
              value={editTask.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            <Input
              name="dueDate"
              type="date"
              value={editTask.dueDate.split("T")[0]}
              onChange={handleInputChange}
            />
            <Select.Root
              collection={createListCollection({
                items: [
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ],
              })}
              size="sm"
              value={[editTask.priority]}
              onValueChange={(e) =>
                setEditTask({
                  ...editTask,
                  priority: e.value[0] as Task["priority"],
                })
              }
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select priority" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {createListCollection({
                      items: [
                        { value: "low", label: "Low" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High" },
                      ],
                    }).items.map((priority) => (
                      <Select.Item item={priority} key={priority.value}>
                        {priority.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <Button onClick={handleUpdateTask} colorScheme="blue">
              Update Task
            </Button>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};
