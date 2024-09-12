import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
