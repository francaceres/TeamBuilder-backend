import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsOptional,
} from 'class-validator';
import { UpdateTeamDTO } from '.';
import { Type } from 'class-transformer';

export class UpdateMatchDTO {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  teams?: UpdateTeamDTO[];
}
