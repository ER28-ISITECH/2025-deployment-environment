import type {Task} from "../types/task.ts";
import {Box, Checkbox, createListCollection, Portal, Select} from "@chakra-ui/react";
import {useState} from "preact/hooks";
import {useTasks} from "../hooks/useTasks.ts";

export const TaskRow = ({
                          task,
                          handleSelect,
                          isSelected
                        }: {
  task: Task,
  handleSelect: () => void,
  isSelected: boolean
}) => {
  const {updateTask} = useTasks()

  const [statusValue, setStatusValue] = useState<string[]>([task.status]);

  const statusCollection = createListCollection({
    items: [
      { value: 'pending', label: 'Pending' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
    ]
  })

  const handleStatusChange = (value: string[]) => {
    updateTask.mutate({
      id: task._id,
      task: {
        status: value[0] as Task['status']
      }
    })
    setStatusValue(value);
  }

  return (
    <Box display="flex" gap={4} justifyContent="space-between" alignItems="center" padding="10px" shadow="md" borderRadius="md" borderWidth="1px" >
      <Box>
        <Checkbox.Root onCheckedChange={() => handleSelect()} checked={isSelected}>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Box>
      <Box flex="1" fontWeight="bold">
        {task.title}
      </Box>
      <Box flex="1" textAlign="center">
        {
          task.priority === "high" ? (
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
          )
        }
      </Box>
      <Box
        flex="1"
        textAlign="center"
        borderColor={
          task.status === "pending" ? "red.500" :
            task.status === "in-progress" ? "yellow.500" :
              "green.500"
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
    </Box>
  );
}