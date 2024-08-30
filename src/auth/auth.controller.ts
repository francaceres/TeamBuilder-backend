import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO, SignupDTO } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() DTO: SignupDTO) {
    return this.authService.signup(DTO);
  }

  @Post('login')
  login(@Body() DTO: LoginDTO) {
    return this.authService.login(DTO);
  }
}
