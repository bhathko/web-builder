import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from './modules/project/project.module';
import {
  Project,
  ProjectSchema,
} from './modules/project/schemas/project.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/lowcode',
    ),
    ProjectModule,
  ],
})
export class AppModule {}
