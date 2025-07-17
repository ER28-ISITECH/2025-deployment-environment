import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./entities/task.entity";
import { TaskService } from "./task.service";

@ApiTags("tasks")
@Controller("tasks")
@UsePipes(new ValidationPipe({ transform: true }))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: "Create a new task" })
  @ApiResponse({
    status: 201,
    description: "The task has been successfully created.",
    type: Task,
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.taskService.create(createTaskDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: "Retrieve all tasks" })
  @ApiResponse({
    status: 200,
    description: "A list of tasks has been successfully retrieved.",
    type: [Task],
  })
  async findAll(): Promise<Task[]> {
    try {
      return await this.taskService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve a task by ID" })
  @ApiResponse({
    status: 200,
    description: "The task has been successfully retrieved.",
    type: Task,
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  async findOne(@Param("id") id: string): Promise<Task> {
    if (!id) {
      throw new HttpException("Task ID is required", HttpStatus.BAD_REQUEST);
    }

    let task: Task | null;

    try {
      task = await this.taskService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!task) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    return task;
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a task by ID" })
  @ApiResponse({
    status: 200,
    description: "The task has been successfully updated.",
    type: Task,
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  async update(
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (!id) {
      throw new HttpException("Task ID is required", HttpStatus.BAD_REQUEST);
    }

    let task: Task | null;

    try {
      task = await this.taskService.update(id, updateTaskDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!task) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    return task;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a task by ID" })
  @ApiResponse({
    status: 204,
    description: "The task has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  async remove(@Param("id") id: string): Promise<void> {
    if (!id) {
      throw new HttpException("Task ID is required", HttpStatus.BAD_REQUEST);
    }

    let task: Task | null;

    try {
      task = await this.taskService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!task) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }
  }
}
