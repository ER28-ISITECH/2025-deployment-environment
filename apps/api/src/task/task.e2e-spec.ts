import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { MockTaskRepository } from "./mock.task.repository";
import { TaskModule } from "./task.module";
import { TaskRepository } from "./task.repository"; // Import the actual TaskRepository for token

describe("TaskController (e2e)", () => {
  let app: INestApplication;
  let mockTaskRepository: MockTaskRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TaskModule],
    })
      .overrideProvider(TaskRepository) // Override the real TaskRepository
      .useClass(MockTaskRepository) // Use the MockTaskRepository instead
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // Apply global pipes for validation
    await app.init();

    // Get the instance of the MockTaskRepository to clear data between tests
    mockTaskRepository = moduleFixture.get<MockTaskRepository>(TaskRepository);
  });

  beforeEach(async () => {
    await mockTaskRepository.clear(); // Clear the mock database before each test
  });

  afterAll(async () => {
    await app.close();
  });

  it("/tasks (POST) - should create a task", async () => {
    const createTaskDto: CreateTaskDto = {
      title: "E2E Test Task",
      description: "Description for E2E task",
      dueDate: new Date("2025-01-01T00:00:00.000Z"),
      priority: "medium",
      status: "pending",
    };

    const response = await request(app.getHttpServer())
      .post("/tasks")
      .send(createTaskDto)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.title).toBe(createTaskDto.title);
    expect(response.body._id).toBeDefined();

    const tasksInDb = await mockTaskRepository.findAll();
    expect(tasksInDb).toHaveLength(1);
    expect(tasksInDb[0].title).toBe(createTaskDto.title);
  });

  it("/tasks (POST) - should return 400 for invalid data", () => {
    return request(app.getHttpServer())
      .post("/tasks")
      .send({
        title: 123, // Invalid type
        description: "Description",
        dueDate: "invalid-date", // Invalid date string
        priority: "high",
        status: "pending",
      })
      .expect(400);
  });

  it("/tasks (GET) - should return all tasks", async () => {
    const tasksToSeed: CreateTaskDto[] = [
      {
        title: "Task 1",
        description: "Desc 1",
        dueDate: new Date(),
        priority: "low",
        status: "pending",
      },
      {
        title: "Task 2",
        description: "Desc 2",
        dueDate: new Date(),
        priority: "medium",
        status: "in-progress",
      },
    ];
    await mockTaskRepository.seed(tasksToSeed);

    const response = await request(app.getHttpServer())
      .get("/tasks")
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe("Task 1");
    expect(response.body[1].title).toBe("Task 2");
  });

  it("/tasks/:id (GET) - should return a task by ID", async () => {
    const createdTask = await mockTaskRepository.create({
      title: "Find Me E2E",
      description: "This task should be found by ID",
      dueDate: new Date(),
      priority: "low",
      status: "pending",
    });

    const response = await request(app.getHttpServer())
      .get(`/tasks/${createdTask._id}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body._id).toBe(createdTask._id);
    expect(response.body.title).toBe("Find Me E2E");
  });

  it("/tasks/:id (GET) - should return 404 if task not found", () => {
    return request(app.getHttpServer())
      .get("/tasks/non-existent-id")
      .expect(404);
  });

  it("/tasks/:id (PATCH) - should update a task by ID", async () => {
    const createdTask = await mockTaskRepository.create({
      title: "Original E2E",
      description: "Original Desc E2E",
      dueDate: new Date(),
      priority: "low",
      status: "pending",
    });

    const updateTaskDto: UpdateTaskDto = {
      title: "Updated E2E Title",
      status: "completed",
    };

    const response = await request(app.getHttpServer())
      .patch(`/tasks/${createdTask._id}`)
      .send(updateTaskDto)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body._id).toBe(createdTask._id);
    expect(response.body.title).toBe("Updated E2E Title");
    expect(response.body.status).toBe("completed");

    const updatedTaskInDb = await mockTaskRepository.findOne(createdTask._id);
    expect(updatedTaskInDb?.title).toBe("Updated E2E Title");
    expect(updatedTaskInDb?.status).toBe("completed");
  });

  it("/tasks/:id (PATCH) - should return 404 if task to update not found", () => {
    const updateTaskDto: UpdateTaskDto = { title: "Updated Title" };
    return request(app.getHttpServer())
      .patch("/tasks/non-existent-id")
      .send(updateTaskDto)
      .expect(404);
  });

  it("/tasks/:id (PATCH) - should return 400 for invalid update data", async () => {
    const createdTask = await mockTaskRepository.create({
      title: "Original",
      description: "Original Desc",
      dueDate: new Date(),
      priority: "low",
      status: "pending",
    });

    return request(app.getHttpServer())
      .patch(`/tasks/${createdTask._id}`)
      .send({ priority: "invalid-priority" }) // Invalid enum value
      .expect(400);
  });

  it("/tasks/:id (DELETE) - should remove a task by ID", async () => {
    const createdTask = await mockTaskRepository.create({
      title: "Task to Delete E2E",
      description: "This will be deleted E2E",
      dueDate: new Date(),
      priority: "low",
      status: "pending",
    });

    await request(app.getHttpServer())
      .delete(`/tasks/${createdTask._id}`)
      .expect(204);

    const taskInDb = await mockTaskRepository.findOne(createdTask._id);
    expect(taskInDb).toBeNull();
  });

  it("/tasks/:id (DELETE) - should return 404 if task to remove not found", () => {
    return request(app.getHttpServer())
      .delete("/tasks/non-existent-id")
      .expect(404);
  });
});
