import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePlayerInTeamDTO } from 'src/modules/players/dto/create-player-in-team.dto';
import { TeamResults } from '@prisma/client';

export class CreateTeamInMatchDTO {
  @IsUUID()
  teamId: string;

  @IsOptional()
  result?: TeamResults;

  @IsOptional()
  score?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlayerInTeamDTO)
  players: CreatePlayerInTeamDTO[];
}
