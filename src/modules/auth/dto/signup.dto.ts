import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDTO {
  @ApiProperty({
    description: 'Name that identifies users',
    uniqueItems: false,
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@mail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ minLength: 6, example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
