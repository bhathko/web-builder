import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ComponentType } from '../interfaces/component-tree.interface';

export type RootComponentDocument = HydratedDocument<RootComponentEntity>;

@Schema({ _id: false })
export class ComponentNode {
  @Prop({ required: true })
  id: string;

  @Prop({ type: [String], required: true })
  class: string[];

  @Prop({ type: String, enum: ComponentType, required: true })
  type: ComponentType;

  @Prop({ required: false })
  content: string;

  @Prop({ type: Object, required: false })
  props: Record<string, string>;

  @Prop({ type: [Object], required: false })
  children?: ComponentNode[];
}

export const ComponentNodeSchema = SchemaFactory.createForClass(ComponentNode);

@Schema()
export class RootComponentEntity {
  @Prop({ required: true })
  pageName: string;

  @Prop({ required: true })
  pageId: string;

  @Prop({ type: ComponentNodeSchema, required: true })
  component: ComponentNode;

  @Prop({ type: String, required: false })
  status?: 'pending' | 'building' | 'done' | 'failed';

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: String, required: false })
  zipPath?: string;

  @Prop({ type: String, required: false })
  projectDir?: string;

  @Prop({ type: String, required: false })
  errorMessage?: string;
}

export const RootComponentSchema =
  SchemaFactory.createForClass(RootComponentEntity);
