import { IsUUID, IsOptional } from 'class-validator';

export class UpdatePlayerInTeamDTO {
  @IsUUID()
  playerId: string;

  @IsOptional()
  isActive?: boolean;
}
