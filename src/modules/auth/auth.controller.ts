import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SignupDTO } from './dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() DTO: SignupDTO) {
    return this.authService.signup(DTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
