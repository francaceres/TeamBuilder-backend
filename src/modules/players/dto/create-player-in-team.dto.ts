import { IsUUID } from 'class-validator';

export class CreatePlayerInTeamDTO {
  @IsUUID()
  playerId: string;
}
