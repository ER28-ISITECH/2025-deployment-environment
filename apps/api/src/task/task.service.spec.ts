import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./entities/task.entity";
import { TaskRepository } from "./task.repository"; // Import Model from mongoose
import { TaskService } from "./task.service";

// Mock the Mongoose Model for Task
const mockTaskModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe("TaskService", () => {
  let service: TaskService;
  let repository: TaskRepository; // This will be the mocked repository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          // Provide a mock for TaskRepository
          provide: TaskRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<TaskRepository>(TaskRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should successfully create a task", async () => {
      const createTaskDto: CreateTaskDto = {
        title: "New Task",
        description: "Description for new task",
        dueDate: new Date(),
        priority: "medium",
        status: "pending",
      };
      const createdTask: Task = {
        _id: "1",
        ...createTaskDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the repository's create method to return the created task
      jest.spyOn(repository, "create").mockResolvedValue(createdTask);

      const result = await service.create(createTaskDto);
      expect(result).toEqual(createdTask);
      expect(repository.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      const tasks: Task[] = [
        {
          _id: "1",
          title: "Task 1",
          description: "Desc 1",
          dueDate: new Date(),
          priority: "low",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "2",
          title: "Task 2",
          description: "Desc 2",
          dueDate: new Date(),
          priority: "high",
          status: "in-progress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock the repository's findAll method
      jest.spyOn(repository, "findAll").mockResolvedValue(tasks);

      const result = await service.findAll();
      expect(result).toEqual(tasks);
      expect(repository.findAll).toHaveBeenCalled();
    });

    it("should return an empty array if no tasks exist", async () => {
      jest.spyOn(repository, "findAll").mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a single task by ID", async () => {
      const taskId = "123";
      const task: Task = {
        _id: taskId,
        title: "Test Task",
        description: "Desc",
        dueDate: new Date(),
        priority: "medium",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, "findOne").mockResolvedValue(task);

      const result = await service.findOne(taskId);
      expect(result).toEqual(task);
      expect(repository.findOne).toHaveBeenCalledWith(taskId);
    });

    it("should return null if task not found", async () => {
      const taskId = "nonexistent";
      jest.spyOn(repository, "findOne").mockResolvedValue(null);

      const result = await service.findOne(taskId);
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith(taskId);
    });
  });

  describe("update", () => {
    it("should successfully update a task", async () => {
      const taskId = "123";
      const updateTaskDto: UpdateTaskDto = { title: "Updated Title" };
      const updatedTask: Task = {
        _id: taskId,
        title: "Updated Title",
        description: "Original Desc",
        dueDate: new Date(),
        priority: "medium",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, "update").mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateTaskDto);
      expect(result).toEqual(updatedTask);
      expect(repository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });

    it("should return null if task to update not found", async () => {
      const taskId = "nonexistent";
      const updateTaskDto: UpdateTaskDto = { title: "Updated Title" };
      jest.spyOn(repository, "update").mockResolvedValue(null);

      const result = await service.update(taskId, updateTaskDto);
      expect(result).toBeNull();
      expect(repository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
    });
  });

  describe("remove", () => {
    it("should successfully remove a task", async () => {
      const taskId = "123";
      const removedTask: Task = {
        _id: taskId,
        title: "Removed Task",
        description: "Desc",
        dueDate: new Date(),
        priority: "low",
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, "remove").mockResolvedValue(removedTask);

      const result = await service.remove(taskId);
      expect(result).toEqual(removedTask);
      expect(repository.remove).toHaveBeenCalledWith(taskId);
    });

    it("should return null if task to remove not found", async () => {
      const taskId = "nonexistent";
      jest.spyOn(repository, "remove").mockResolvedValue(null);

      const result = await service.remove(taskId);
      expect(result).toBeNull();
      expect(repository.remove).toHaveBeenCalledWith(taskId);
    });
  });
});
