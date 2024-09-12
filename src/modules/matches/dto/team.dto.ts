import { TeamResults } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MatchPlayerDTO } from 'src/modules/players/dto';

export class TeamDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(TeamResults)
  result?: TeamResults;

  @IsOptional()
  @IsInt()
  score?: number;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MatchPlayerDTO)
  players: MatchPlayerDTO[];
}
