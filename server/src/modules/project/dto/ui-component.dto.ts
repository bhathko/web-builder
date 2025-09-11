import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ComponentType } from '../models/ui-component.model';

export class UIComponentDto {
  @IsString()
  id: string;

  @IsArray()
  @IsString({ each: true })
  class: string[];

  @IsEnum(ComponentType)
  type: ComponentType;

  @IsString()
  content: string;

  @IsObject()
  props: Record<string, string>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UIComponentDto)
  children?: UIComponentDto[];
}
