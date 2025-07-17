import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Task} from "./entities/task.entity";
import {Model} from "mongoose";

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {
  }

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  findAll() : Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  findOne(id: string) : Promise<Task | null> {
    return this.taskModel.findById(id).exec();
  }

  update(id: string, updateTaskDto: UpdateTaskDto) : Promise<Task | null> {
    return this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
  }

  remove(id: string) : Promise<Task | null> {
    return this.taskModel.findByIdAndDelete(id).exec();
  }
}
