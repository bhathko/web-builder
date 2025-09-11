import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { UIComponentDto } from './ui-component.dto';

export class BuildProjectDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @Type(() => Date)
  lastModifyDate: Date;

  @ValidateNested()
  @Type(() => UIComponentDto)
  component: UIComponentDto;
}
