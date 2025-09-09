import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RootComponentEntity,
  RootComponentDocument,
} from 'src/component-tree/schemas/component-tree.schema';
import { RootComponentDto } from './dto/root-component.dto';

@Injectable()
export class ComponentTreeService {
  private logger = new Logger(ComponentTreeService.name);
  constructor(
    @InjectModel(RootComponentEntity.name)
    private rootComponentModel: Model<RootComponentDocument>,
  ) {}

  async create(dto: RootComponentDto): Promise<RootComponentEntity> {
    return this.rootComponentModel.create(dto);
  }

  async findAll(): Promise<RootComponentEntity[]> {
    return this.rootComponentModel.find().exec();
  }

  async findOne(id: string): Promise<RootComponentEntity | null> {
    return this.rootComponentModel.findById(id).exec();
  }

  async update(
    id: string,
    dto: Partial<RootComponentDto>,
  ): Promise<RootComponentEntity | null> {
    return this.rootComponentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<RootComponentEntity | null> {
    return this.rootComponentModel.findByIdAndDelete(id).exec();
  }
}
