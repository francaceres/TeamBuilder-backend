import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  groupId: string;
}
