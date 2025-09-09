import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComponentTreeController } from './component-tree/component-tree.controller';
import { ComponentTreeService } from './component-tree/component-tree.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { RootComponentEntity, RootComponentSchema } from './component-tree/schemas/component-tree.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/lowcode',
    ),
    MongooseModule.forFeature([
      { name: RootComponentEntity.name, schema: RootComponentSchema },
    ]),
  ],
  controllers: [AppController, ComponentTreeController, ProjectController],
  providers: [AppService, ComponentTreeService, ProjectService],
})
export class AppModule {}
