import { Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log(`Creating task: ${JSON.stringify(createTaskDto)}`);
    return this.taskRepository.create(createTaskDto);
  }

  async findAll(): Promise<Task[]> {
    this.logger.log('Finding all tasks');
    return this.taskRepository.findAll();
  }

  async findOne(id: string): Promise<Task | null> {
    this.logger.log(`Finding task with ID: ${id}`);
    return this.taskRepository.findOne(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    this.logger.log(`Updating task with ID: ${id}`);
    return this.taskRepository.update(id, updateTaskDto);
  }

  async remove(id: string): Promise<Task | null> {
    this.logger.log(`Removing task with ID: ${id}`);
    return this.taskRepository.remove(id);
  }
}
