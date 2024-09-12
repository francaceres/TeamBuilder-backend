import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDTO {
  @ApiProperty({
    description: 'The new email for the user',
    example: 'user@example.com',
  })
  @IsEmail()
  newEmail: string;

  @ApiProperty({
    description: 'User password for verification',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
