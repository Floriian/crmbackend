import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { GetUser, Roles } from '../auth/decorator';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { User } from '../user/entities/user.entity';
import { Role } from '../auth/role.enum';

@Controller('tasks')
@UseGuards(JwtGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles(Role.ADMIN, Role.CEO, Role.USER)
  @Get()
  getTasks(@GetUser() user: User) {
    console.log(user);
    return this.tasksService.getTasks(user);
  }

  @Get('all')
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() dto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.createTask(dto, user);
  }

  //TODO: authorization
  @Post('everyone')
  createTasks(@Body() dto: Required<CreateTaskDto>) {
    return this.tasksService.createTasks(dto);
  }
}
