import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';
import configYaml from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configYaml],
    }),
    MongooseModule.forRoot(
      'mongodb://crmuser:crmpassword@localhost:27017/crm?readPreference=primary&ssl=false&directConnection=true',
    ),
    AuthModule,
    UserModule,
    TasksModule,
  ],
})
export class AppModule {}
