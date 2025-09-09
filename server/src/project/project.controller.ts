import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { createReadStream } from 'fs';
import type { Response } from 'express';
import path from 'path';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  logger = new Logger(ProjectController.name);
  @Post('generate/:id')
  async generate(@Param('id') id: string) {
    this.logger.log(`Generating project with id: ${id}`);
    await this.projectService.generateProject(id);
    return { message: 'Project generation started' };
  }

  @Get('status/:id')
  async status(@Param('id') id: string) {
    const status = await this.projectService.getStatus(id);
    return { status };
  }

  @Get('status/:ids')
  async getStatuses(@Param('ids') ids: string) {
    const idArray = ids.split(',');
    const statuses = await Promise.all(
      idArray.map((id) => this.projectService.getStatus(id)),
    );
    return { statuses };
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const filePath = await this.projectService.getZipPath(id);
    if (!filePath) {
      throw new HttpException('File not ready', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Downloading project zip for id: ${filePath}`);
    const file = createReadStream(filePath);

    const fileName = path.basename(filePath);
    this.logger.log(`File name: ${fileName}`);

    res.set({
      'Content-Type': 'application/zip', // <-- fix here
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });
    file.pipe(res);
  }
}
