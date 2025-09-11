import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Project } from './schemas/project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import archiver from 'archiver';

@Injectable()
export class ProjectService {
  private logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<Project>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    return this.projectModel.create({ ...dto, lastModifyDate: new Date() });
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findOne(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).exec();
  }

  async update(id: string, dto: Partial<Project>): Promise<Project | null> {
    return this.projectModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string): Promise<Project | null> {
    return this.projectModel.findByIdAndDelete(id).exec();
  }

  async buildProject(id: Types.ObjectId, name: string): Promise<void> {
    const builderToolDir = path.join(__dirname, '../../../../schematic-tool');
    if (!fs.existsSync(builderToolDir)) {
      this.logger.error(
        `Builder tool directory does not exist: ${builderToolDir}`,
      );
      throw new HttpException('Builder tool not found', HttpStatus.NOT_FOUND);
    }

    this.logger.log(`Starting project generation for ID: ${id}`);
    this.logger.log(`Current window Directory Path: ${builderToolDir}`);
    this.logger.log(`npm run start:schematics -- ${id}`);

    const child = spawn('npm', ['run', 'start:schematics', '--', `${id}`], {
      cwd: builderToolDir,
      shell: true,
    });

    child.unref();

    child.stderr.on('data', (data) => {
      // This is where you'll find the error message from the child process.
      this.logger.error(`Error from child process: ${data.toString()}`);
    });
    // Optionally, you can listen for process exit and update status
    child.on('exit', async (code) => {
      this.logger.log(`Project generation process exited with code: ${code}`);
      const status = code === 0 ? 'done' : 'failed';
      let projectDir = '';
      if (status === 'done') {
        projectDir = path.join(__dirname, '../../../../projects', name);
      }
      await this.projectModel.findByIdAndUpdate(
        id,
        { status, projectDir, updatedAt: new Date() },
        { new: true },
      );
    });
    child.on('error', (error) => {
      this.logger.error(
        `Error occurred while generating project: ${error.message}`,
      );
    });
  }

  async getZipPath(id: string): Promise<string | null> {
    // Check if build is done
    const doc = await this.projectModel.findById<Project>(id);
    if (!doc || !doc.status || doc.status !== 'done') return null;

    this.logger.log(`Compressing project directory for `);

    // If zip doesn't exist, create it
    this.logger.log(
      `Compressing project directory: ${doc.projectDir} ${!fs.existsSync(doc.projectDir as string)}`,
    );
    if (doc.projectDir && !fs.existsSync(`${doc.projectDir}.zip`)) {
      let zipPath = `${doc.projectDir}.zip`;

      await this.compressProject(doc.projectDir, zipPath);
      await this.projectModel.findByIdAndUpdate(
        id,
        { zipPath, updatedAt: new Date() },
        { new: true },
      );
      return zipPath;
    }
    throw new HttpException(
      'Project directory not found',
      HttpStatus.NOT_FOUND,
    );
  }

  private async compressProject(
    sourceDir: string,
    outPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }
}
