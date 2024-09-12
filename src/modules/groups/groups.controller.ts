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
import { GroupVisualization, UserInGroupRole } from '@prisma/client';
import { RoleBasedGroupAccessGuard } from 'src/shared/guards';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AdminRoleSwaggerDescription,
  OwnerRoleSwaggerDescription,
} from 'src/shared/constants';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creates new group and associates current user as owner',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  createGroup(@Body() dto: CreateGroupDTO, @CurrentUser() user: RequestUser) {
    return this.groupService.createGroup(dto, user);
  }

  @ApiOperation({ summary: 'Gets group public info' })
  @ApiResponse({
    status: 200,
    example: {
      name: 'Group 1',
      description: 'This is group 1',
      createdAt: new Date(),
      visualization: GroupVisualization.PRIVATE,
    },
  })
  @Get('/:groupId')
  getGroupInfo(@Param('groupId') groupId: string) {
    return this.groupService.getGroupInfo(groupId);
  }

  @ApiOperation({
    summary: 'Updates group public info and visualization',
    description: AdminRoleSwaggerDescription,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Patch(':groupId')
  updateGroup(@Param('groupId') groupId: string, @Body() dto: UpdateGroupDTO) {
    return this.groupService.updateGroup(groupId, dto);
  }

  @ApiOperation({
    summary: 'Deletes group and related records',
    description: OwnerRoleSwaggerDescription,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.OWNER])
  @Delete(':groupId')
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.deleteGroup(groupId);
  }

  @ApiOperation({
    summary: 'Edits users roles in a group or adds new ones',
    description: AdminRoleSwaggerDescription,
  })
  @ApiQuery({ enum: UserInGroupRole })
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: 'Checks groups where a given user is the only member',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all groups that match the condition',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/empty/:userId')
  checkGroupsToBeEmptied(@Param('userId') userId: string) {
    return this.groupService.checkGroupsToBeEmptied(userId);
  }
}
