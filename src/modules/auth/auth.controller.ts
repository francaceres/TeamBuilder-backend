import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignupDTO } from './dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 201, description: 'User created succesfully' })
  @Post('signup')
  signup(@Body() DTO: SignupDTO) {
    return this.authService.signup(DTO);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'User logged in, returns jwt token',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
