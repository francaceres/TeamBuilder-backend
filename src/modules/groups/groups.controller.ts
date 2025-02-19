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
import { FindManyOptionsDTO } from 'src/shared/dto';
import { GroupAccessGuard } from 'src/shared/guards';

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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets all groups that belong to the current logged in user',
  })
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  getMyGroups(
    @CurrentUser() user: RequestUser,
    @Query() query: FindManyOptionsDTO,
  ) {
    return this.groupService.getMyGroups(user, query);
  }

  @ApiOperation({
    summary:
      'Gets group public info and checks if the user is associated to the group and can edit',
  })
  @ApiResponse({
    status: 200,
    example: {
      name: 'Group 1',
      description: 'This is group 1',
      createdAt: new Date(),
      visualization: GroupVisualization.PRIVATE,
      canEdit: false,
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:groupId')
  getGroupInfo(
    @Param('groupId') groupId: string,
    @CurrentUser() user: RequestUser | null,
  ) {
    return this.groupService.getGroupInfo(groupId, user);
  }

  @ApiOperation({
    summary: 'Updates group public info and visualization',
    description: AdminRoleSwaggerDescription,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, GroupAccessGuard)
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
  @UseGuards(JwtAuthGuard, GroupAccessGuard)
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
  @UseGuards(JwtAuthGuard, GroupAccessGuard)
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
