import { GroupVisualization } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GroupVisualization)
  visualization?: GroupVisualization;
}
