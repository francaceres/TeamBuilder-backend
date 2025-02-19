import { TeamResults } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UpdatePlayerInTeamDTO } from 'src/modules/players/dto/update-player-in-team.dto';

export class UpdateTeamInMatchDTO {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlayerInTeamDTO)
  players?: UpdatePlayerInTeamDTO[];

  @IsOptional()
  @IsEnum(TeamResults)
  result?: TeamResults;

  @IsOptional()
  @IsInt()
  score?: number;
}
