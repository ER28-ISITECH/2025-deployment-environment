import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Input,
  Portal,
  Textarea,
  VStack,
  Field,
  Select,
  createListCollection, HStack,
} from '@chakra-ui/react';
import {useTasks} from "../hooks/useTasks.ts";
import type {CreateTaskRequest} from "../types/task.ts";
import {useState} from "preact/hooks";

const priorities = createListCollection({
  items: [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ],
});

const statuses = createListCollection({
  items: [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ],
});

export const AddTaskModal = () => {
  const { register, handleSubmit, reset } = useForm<CreateTaskRequest>();
  const { createTask } = useTasks()
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (data: CreateTaskRequest) => {
    createTask.mutate({
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
      priority: data.priority,
      status: data.status,
    }, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
    reset();
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    reset();
  }

  const handleClose = () => {
    setIsOpen(false);
    reset();
  }

  return (
    <Box>
      <Button onClick={toggleModal} size="sm">Add task</Button>
      {
        isOpen && (
          <Box p={2} mt={2} shadow="md" borderRadius="md">
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
              <VStack align="stretch">
                <Field.Root>
                  <Field.Label>
                    Title <Field.RequiredIndicator />
                  </Field.Label>
                  <Input id="title" {...register('title', { required: true })} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Description</Field.Label>
                  <Textarea id="description" {...register('description', {required: true})} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>
                    Due Date <Field.RequiredIndicator />
                  </Field.Label>
                  <Input id="dueDate" type="date" {...register('dueDate', { required: true })} />
                </Field.Root>

                <Field.Root>
                  <Field.Label>
                    Priority <Field.RequiredIndicator />
                  </Field.Label>
                  <Select.Root collection={priorities} {...register('priority', { required: true })}>
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select priority" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                        <Select.ClearTrigger />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {priorities.items.map((priority) => (
                            <Select.Item item={priority} key={priority.value}>
                              {priority.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>
                    Status <Field.RequiredIndicator />
                  </Field.Label>
                  <Select.Root collection={statuses} {...register('status', { required: true })}>
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select status" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                        <Select.ClearTrigger />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {statuses.items.map((status) => (
                            <Select.Item item={status} key={status.value}>
                              {status.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Field.Root>
              </VStack>
              <HStack mt={4} justifyContent="flex-end">
                <Button type="submit" onClick={handleSubmit(onSubmit)}>
                  Create
                </Button>

                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </HStack>
            </Box>
          </Box>
        )
      }
    </Box>
  );
};
