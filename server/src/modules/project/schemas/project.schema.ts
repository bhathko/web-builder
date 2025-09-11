import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UIComponent, UIComponentSchema } from './ui-component.schema';
import { Types, Document } from 'mongoose';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Date, required: true })
  lastModifyDate: Date;

  @Prop({ type: UIComponentSchema, required: true })
  component: UIComponent;

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

export const ProjectSchema = SchemaFactory.createForClass(Project);
