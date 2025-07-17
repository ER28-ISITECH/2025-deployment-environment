import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsString } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({
    example: "Complete project documentation",
    description: "The title of the task",
  })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      "Write detailed documentation for the project including setup, usage, and API references.",
    description: "A detailed description of the task",
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: "2023-12-31T23:59:59.999Z",
    description: "The due date for the task",
  })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({
    example: "high",
    description: "The priority of the task",
    enum: ["low", "medium", "high"],
  })
  @IsString()
  @IsEnum(["low", "medium", "high"])
  priority: "low" | "medium" | "high";

  @ApiProperty({
    example: "pending",
    description: "The current status of the task",
    enum: ["pending", "in-progress", "completed"],
  })
  @IsString()
  @IsEnum(["pending", "in-progress", "completed"])
  status: "pending" | "in-progress" | "completed";
}
