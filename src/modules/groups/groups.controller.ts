import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateGroupDTO, UpdateGroupDTO } from './dto';
import { GroupsService } from './groups.service';
import { CurrentUser, GroupRoles } from 'src/shared/decorators';
import { RequestUser } from 'src/shared/types';
import { JwtAuthGuard } from '../auth/guards';
import { UserInGroupRole } from '@prisma/client';
import { RoleBasedGroupAccessGuard } from 'src/shared/guards';

@Controller('groups')
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createGroup(@Body() dto: CreateGroupDTO, @CurrentUser() user: RequestUser) {
    return this.groupService.createGroup(dto, user);
  }

  @Get('/:groupId')
  getGroupInfo(@Param('groupId') groupId: string) {
    return this.groupService.getGroupInfo(groupId);
  }

  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Patch(':groupId')
  updateGroup(@Param('groupId') groupId: string, @Body() dto: UpdateGroupDTO) {
    return this.groupService.updateGroup(groupId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.OWNER])
  @Delete(':groupId')
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.deleteGroup(groupId);
  }

  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Patch(':groupId/user/:userId')
  editUserRolesInGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Query('role') role: UserInGroupRole,
    @CurrentUser() user: RequestUser,
  ) {
    return this.groupService.editUserRolesInGroup(groupId, userId, role, user);
  }
}
