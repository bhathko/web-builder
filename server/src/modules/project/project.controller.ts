import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { extractErrorMessage } from 'src/utils/error-message.util';
import { Project } from './schemas/project.schema';
import { createReadStream } from 'fs';
import path from 'path';
import { Types } from 'mongoose';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  logger = new Logger(ProjectController.name);

  @Post('')
  async create(@Body() dto: CreateProjectDto) {
    try {
      const result = await this.projectService.create(dto);
      return { message: 'Created successfully', data: result };
    } catch (error: unknown) {
      this.logger.error('Error to create project', error);
      throw new HttpException(
        extractErrorMessage(error, 'An error occurred'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('all')
  async findAll() {
    try {
      const result = await this.projectService.findAll();

      return { message: 'Fetched successfully', data: result };
    } catch (error: unknown) {
      throw new HttpException(
        extractErrorMessage(error, 'An error occurred'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.projectService.findOne(id);
      if (!result) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Fetched successfully', data: result };
    } catch (error) {
      throw new HttpException(
        extractErrorMessage(error, 'An error occurred'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<Project>) {
    try {
      const result = await this.projectService.update(id, dto);
      if (!result) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Updated successfully', data: result };
    } catch (error) {
      throw new HttpException(
        extractErrorMessage(error, 'An error occurred'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.projectService.remove(id);
      if (!result) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Deleted successfully', data: result };
    } catch (error) {
      throw new HttpException(
        extractErrorMessage(error, 'An error occurred'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('build/:id')
  async build(@Param('id') id: string) {
    this.logger.log(`Building project with id: ${id}`);
    try {
      const project = await this.projectService.findOne(id);
      if (!project) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      await this.projectService.buildProject(
        project._id as Types.ObjectId,
        project.name,
      );
      return { message: 'Project build started', data: true };
    } catch (error) {
      this.logger.error('Error building project', error);
      throw new HttpException(
        extractErrorMessage(error, 'An error occurred'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('status/:id')
  async status(@Param('id') id: string) {
    const project = await this.projectService.findOne(id);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return { status: project.status };
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const filePath = await this.projectService.getZipPath(id);
    if (!filePath) {
      throw new HttpException('File not ready', HttpStatus.BAD_REQUEST);
    }
    this.logger.log(`Downloading project zip for id: ${filePath}`);
    try {
      const file = createReadStream(filePath);

      const project = await this.projectService.findOne(id);
      if (!project) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`File name: ${project.name}.zip`);

      res.set({
        'Content-Type': 'application/zip', // <-- fix here
        'Content-Disposition': `attachment; filename="${project.name}.zip"`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
      });
      file.pipe(res);
    } catch (error) {
      this.logger.error('Error to download project', error);
      throw new HttpException(
        extractErrorMessage(error, 'An error occurred'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
