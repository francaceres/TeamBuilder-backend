import { IsArray, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTeamInMatchDTO } from 'src/modules/teams/dto';

export class CreateMatchDTO {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamInMatchDTO)
  teams: CreateTeamInMatchDTO[];
}
