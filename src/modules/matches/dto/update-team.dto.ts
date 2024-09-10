import { TeamResults } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { MatchPlayerDTO } from 'src/modules/players/dto';

export class UpdateTeamDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(TeamResults)
  result?: TeamResults;

  @IsOptional()
  @IsInt()
  score?: number;

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MatchPlayerDTO)
  players?: MatchPlayerDTO[];
}
