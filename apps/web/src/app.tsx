import { Box, Heading, Stack } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AddTaskModal } from './components/AddTaskModal.tsx';
import { TaskList } from './components/TaskList.tsx';
import { useTasks } from './hooks/useTasks.ts';
import {Provider} from "./components/ui/provider.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  const { todos } = useTasks();

  if (todos.isLoading) {
    return <Box>Loading...</Box>;
  }

  if (todos.error) {
    return <Box>
      Unable to load tasks. Please try again later.
    </Box>;
  }

  return (
    <Box mx="10" mt={8}>
      <Stack>
        <Heading as="h1" size="xl" textAlign="center">
          Todo App
        </Heading>
        <AddTaskModal />
        <TaskList todos={todos.data} />
      </Stack>
    </Box>
  );
};

export const App = () => {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
};

