import { Injectable, Logger } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./entities/task.entity";

@Injectable()
export class MockTaskRepository {
  private readonly logger = new Logger(MockTaskRepository.name);
  private tasks: Map<string, Task> = new Map();
  private currentId = 1;

  // Generate a simple ID for testing
  private generateId(): string {
    return (this.currentId++).toString();
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const id = this.generateId();
    const task: Task = {
      _id: id,
      ...createTaskDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.set(id, task);
    this.logger.log(`Created task with ID: ${id}`);
    return Promise.resolve(task);
  }

  async findAll(): Promise<Task[]> {
    const allTasks = Array.from(this.tasks.values());
    this.logger.log(`Found ${allTasks.length} tasks`);
    return Promise.resolve(allTasks);
  }

  async findOne(id: string): Promise<Task | null> {
    const task = this.tasks.get(id) || null;
    this.logger.log(`Looking for task with ID: ${id}, found: ${!!task}`);
    return Promise.resolve(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      this.logger.log(`Task with ID: ${id} not found for update`);
      return Promise.resolve(null);
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updateTaskDto,
      updatedAt: new Date(),
    };

    this.tasks.set(id, updatedTask);
    this.logger.log(`Updated task with ID: ${id}`);
    return Promise.resolve(updatedTask);
  }

  async remove(id: string): Promise<Task | null> {
    const task = this.tasks.get(id);
    if (!task) {
      this.logger.log(`Task with ID: ${id} not found for removal`);
      return Promise.resolve(null);
    }

    this.tasks.delete(id);
    this.logger.log(`Removed task with ID: ${id}`);
    return Promise.resolve(task);
  }

  // Additional utility methods for testing
  async clear(): Promise<void> {
    this.tasks.clear();
    this.currentId = 1;
    this.logger.log("Cleared all tasks from mock repository");
  }

  async count(): Promise<number> {
    return Promise.resolve(this.tasks.size);
  }

  // Method to seed data for testing
  async seed(tasks: CreateTaskDto[]): Promise<Task[]> {
    const createdTasks: Task[] = [];
    for (const taskDto of tasks) {
      const task = await this.create(taskDto);
      createdTasks.push(task);
    }
    return createdTasks;
  }
}
