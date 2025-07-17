import { Module } from "@nestjs/common";
import { MockTaskRepository } from "./mock.task.repository"; // Your mock repository
import { TaskController } from "./task.controller";
import { TaskRepository } from "./task.repository";
import { TaskService } from "./task.service";

/**
 * A testing module for Task features that uses MockTaskRepository
 * instead of the actual Mongoose-backed TaskRepository.
 * This allows for isolated integration testing without a live database connection.
 */
@Module({
  // No MongooseModule.forFeature here, as we are bypassing the real database
  controllers: [TaskController],
  providers: [
    TaskService,
    {
      // Provide the MockTaskRepository when TaskRepository is requested
      provide: TaskRepository,
      useClass: MockTaskRepository,
    },
  ],
  exports: [TaskService, TaskRepository], // Export if other modules need these
})
export class TaskTestingModule {}
