import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './entity/task.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { CreateTaskDto } from './dto/CreateTask.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getTasks(user: User): Promise<Task[]> {
    const userTasks = await this.taskModel.find({
      user: user,
    });
    return userTasks;
  }

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskModel.find();
    return tasks;
  }

  async createTask(dto: CreateTaskDto, user: User) {
    const task = await this.taskModel.create({
      title: dto.title,
      description: dto.description,
      createdAt: Date.now(),
      completed: false,
      user: user,
    });
    console.log(task);
    return task;
  }

  async createTasks(dto: Required<CreateTaskDto>) {
    return 'need to implement';
    // const createTask = await this.taskModel.create({
    //   title: dto.title,
    //   description: dto.description,
    //   createdAt: Date.now(),
    // });

    // const users = await this.userModel.find();
    // for (let user in users) {
    //   const updateUser = await this.userModel.updateOne({
    //     $where: [

    //     ]
    //   })
    // }
  }
}
