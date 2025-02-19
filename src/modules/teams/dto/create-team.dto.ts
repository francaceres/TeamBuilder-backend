import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { MatchPlayerDTO } from 'src/modules/players/dto';

export class CreateTeamDTO {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  name: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MatchPlayerDTO)
  players: MatchPlayerDTO[];
}
