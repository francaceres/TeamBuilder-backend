import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { CurrentUser } from 'src/shared/decorators';
import { RequestUser } from 'src/shared/types';
import { UpdateEmailDTO, UpdatePasswordDTO } from './dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: RequestUser) {
    return this.usersService.getMe(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/email')
  updateEmail(@Body() dto: UpdateEmailDTO, @CurrentUser() user: RequestUser) {
    return this.usersService.updateEmail(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/password')
  updatePassword(
    @Body() dto: UpdatePasswordDTO,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usersService.updatePassword(dto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@CurrentUser() user: RequestUser) {
    return this.usersService.deleteUser(user.id);
  }
}
