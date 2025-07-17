import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {TaskRepository} from "./task.repository";

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
  ) {
  }

  create(createTaskDto: CreateTaskDto) {
    return this.taskRepository.create(createTaskDto);
  }

  findAll() {
    return this.taskRepository.findAll();
  }

  findOne(id: string) {
    return this.taskRepository.findOne(id);
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.taskRepository.update(id, updateTaskDto);
  }

  remove(id: string) {
    return this.taskRepository.remove(id);
  }
}
