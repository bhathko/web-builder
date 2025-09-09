/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ComponentType } from '../interfaces/component-tree.interface';

export class ComponentNodeDto {
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
  @Type(() => ComponentNodeDto)
  children?: ComponentNodeDto[];
}

export class RootComponentDto {
  @IsString()
  pageName: string;

  @IsString()
  pageId: string;

  @ValidateNested()
  @Type(() => ComponentNodeDto)
  component: ComponentNodeDto;
}
