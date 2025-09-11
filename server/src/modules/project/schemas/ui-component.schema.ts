import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ComponentType } from '../models/ui-component.model';

@Schema({ _id: false })
export class UIComponent {
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
  children?: UIComponent[];
}

export const UIComponentSchema = SchemaFactory.createForClass(UIComponent);
