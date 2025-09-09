import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { RootComponentEntity } from '../component-tree/schemas/component-tree.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import { getLatestCreatedDirectory } from 'src/utils/file-management.util';
import { log } from 'console';

@Injectable()
export class ProjectService {
  private logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(RootComponentEntity.name)
    private rootComponentModel: Model<RootComponentEntity>,
  ) {}

  async generateProject(id: string): Promise<void> {
    const projectDir = path.join(__dirname, '../../../schematic-tool');
    const tmpDir = path.join(__dirname, '../../../tmp');
    if (!fs.existsSync(projectDir))
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);

    if (!fs.existsSync(tmpDir)) {
      throw new HttpException(
        'Temporary directory not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.log(`Starting project generation for ID: ${id}`);
    this.logger.log(`Current window Directory Path: ${projectDir}`);
    this.logger.log(`npm run start:schematics -- ${id}`);

    const child = spawn('npm', ['run', 'start:schematics', '--', `${id}`], {
      cwd: projectDir,
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
        projectDir = getLatestCreatedDirectory(tmpDir) as string;
        projectDir = path.join(__dirname, '../../../tmp', projectDir);
      }
      await this.rootComponentModel.findByIdAndUpdate(
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

  async getStatus(id: string): Promise<string> {
    // Option 1: Read from DB
    const doc = await this.rootComponentModel.findById<RootComponentEntity>(id);
    if (!doc) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return doc.status || 'pending';
  }

  async getZipPath(id: string): Promise<string | null> {
    // Check if build is done
    const doc = await this.rootComponentModel.findById<RootComponentEntity>(id);
    if (!doc || !doc.status || doc.status !== 'done') return null;

    // if (doc.zipPath) {
    //   // If zip already exists, return it
    //   if (fs.existsSync(doc.zipPath)) {
    //     return doc.zipPath;
    //   }
    // }
    this.logger.log(`Compressing project directory for `);

    // If zip doesn't exist, create it
    this.logger.log(
      `Compressing project directory: ${doc.projectDir} ${!fs.existsSync(doc.projectDir as string)}`,
    );
    if (doc.projectDir && !fs.existsSync(`${doc.projectDir}.zip`)) {
      let zipPath = `${doc.projectDir}.zip`;

      await this.compressProject(doc.projectDir, zipPath);
      await this.rootComponentModel.findByIdAndUpdate(
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
