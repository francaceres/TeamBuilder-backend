import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDTO {
  @ApiProperty({
    description: 'Current user password used for verification',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New password for the user',
    example: '654321',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
