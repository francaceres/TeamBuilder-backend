import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlayerDTO {
  @ApiProperty({ description: "Player's name", example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Player's description",
    example: 'This is John Doe',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
