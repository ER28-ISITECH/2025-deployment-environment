import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export type TaskDocument = Task & Document;

@Schema({ timestamps: true, versionKey: false })
export class Task {
  @ApiProperty({
    example: "Complete project documentation",
    description: "The title of the task",
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example:
      "Write detailed documentation for the project including setup, usage, and API references.",
    description: "A detailed description of the task",
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: "2023-12-31T23:59:59.999Z",
    description: "The due date for the task",
  })
  @Prop({ required: true })
  dueDate: Date;

  @ApiProperty({
    example: "high",
    description: "The priority of the task",
    enum: ["low", "medium", "high"],
  })
  @Prop({ required: true, enum: ["low", "medium", "high"] })
  priority: "low" | "medium" | "high";

  @ApiProperty({
    example: "pending",
    description: "The current status of the task",
    enum: ["pending", "in-progress", "completed"],
  })
  @Prop({ required: true, enum: ["pending", "in-progress", "completed"] })
  status: "pending" | "in-progress" | "completed";
}

export const TaskSchema = SchemaFactory.createForClass(Task);
