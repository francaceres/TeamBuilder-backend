import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePlayerDTO {
  @ApiProperty({ description: "Player's name", example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Player's description",
    example: 'This is John Doe',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
