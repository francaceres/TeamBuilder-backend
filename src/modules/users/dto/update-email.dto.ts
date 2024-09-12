import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDTO {
  @IsEmail()
  newEmail: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
