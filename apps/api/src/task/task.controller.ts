import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {Task} from "./entities/task.entity";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Creates a new task with the provided details.',
  })
  @ApiResponse({
    type: Task,
    status: 201,
    description: 'The task has been successfully created.',
  })
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all tasks',
    description: 'Returns a list of all tasks in the system.',
  })
  @ApiResponse({
    type: [Task],
    status: 200,
    description: 'A list of tasks has been successfully retrieved.',
  })
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a task by ID',
    description: 'Returns the details of a specific task identified by its ID.',
  })
  @ApiResponse({
    type: Task,
    status: 200,
    description: 'The task has been successfully retrieved.',
  })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a task by ID',
    description: 'Updates the details of a specific task identified by its ID.',
  })
  @ApiResponse({
    type: Task,
    status: 200,
    description: 'The task has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task by ID',
    description: 'Deletes a specific task identified by its ID.',
  })
  @ApiResponse({
    status: 204,
    description: 'The task has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
