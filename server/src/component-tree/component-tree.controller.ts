import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ComponentTreeService } from './component-tree.service';
import { RootComponentDto } from './dto/root-component.dto';
import { extractErrorMessage } from 'src/utils/error-message.util';

@Controller('component-tree')
export class ComponentTreeController {
  constructor(private readonly componentTreeService: ComponentTreeService) {}
  private logger = new Logger(ComponentTreeController.name);
  @Post()
  async create(@Body() dto: RootComponentDto) {
    try {
      const result = await this.componentTreeService.create(dto);
      return { message: 'Created successfully', data: result };
    } catch (error: unknown) {
      this.logger.error('Error creating component', error);
      throw new HttpException(
        extractErrorMessage(error, 'An error occurred'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.componentTreeService.findAll();
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
      const result = await this.componentTreeService.findOne(id);
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
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<RootComponentDto>,
  ) {
    try {
      const result = await this.componentTreeService.update(id, dto);
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
      const result = await this.componentTreeService.remove(id);
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
}
