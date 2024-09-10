import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsOptional,
} from 'class-validator';
import { TeamDTO } from '.';
import { Type } from 'class-transformer';

export class CreateMatchDTO {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  teams: TeamDTO[];
}
