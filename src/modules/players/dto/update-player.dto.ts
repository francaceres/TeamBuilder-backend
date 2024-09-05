import { IsOptional, IsString } from 'class-validator';

export class UpdatePlayerDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
