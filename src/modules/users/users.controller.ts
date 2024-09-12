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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Gets profile of the current logged in user' })
  @ApiResponse({
    status: 200,
    example: {
      name: 'John Doe',
      email: 'user@mail.com',
      createdAt: new Date(),
      groups: 'User in groups array',
    },
  })
  @Get('me')
  getMe(@CurrentUser() user: RequestUser) {
    return this.usersService.getMe(user);
  }

  @ApiOperation({ summary: 'Updates current user email' })
  @Patch('/email')
  updateEmail(@Body() dto: UpdateEmailDTO, @CurrentUser() user: RequestUser) {
    return this.usersService.updateEmail(dto, user);
  }

  @ApiOperation({ summary: 'Updates current user password' })
  @Patch('/password')
  updatePassword(
    @Body() dto: UpdatePasswordDTO,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usersService.updatePassword(dto, user);
  }

  @ApiOperation({ summary: 'Deletes current user and related records' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteUser(@CurrentUser() user: RequestUser) {
    return this.usersService.deleteUser(user.id);
  }
}
