import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateGroupDTO, UpdateGroupDTO, UserToGroupDTO } from './dto';
import { GroupsService } from './groups.service';
import { CurrentUser } from 'src/shared/decorators';
import { RequestUser } from 'src/shared/types';
import { JwtAuthGuard } from '../auth/guards';

@Controller('groups')
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  // CREATE group
  @UseGuards(JwtAuthGuard)
  @Post()
  createGroup(@Body() dto: CreateGroupDTO, @CurrentUser() user: RequestUser) {
    return this.groupService.createGroup(dto, user);
  }

  // GET group info (member or public)
  @Get('/:groupId')
  getGroupInfo(@Param('groupId') groupId: string) {
    return this.groupService.getGroupInfo(groupId);
  }

  // UPDATE group (admin)
  @Patch(':groupId')
  updateGroup(@Param('groupId') groupId: string, @Body() dto: UpdateGroupDTO) {
    return this.groupService.updateGroup(groupId, dto);
  }

  // DELETE group (owner)
  @Delete(':groupId')
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.deleteGroup(groupId);
  }

  // Add user to group (admin)
  // Edit user permissions (admin)
  // Transfer ownership (owner)
  @Patch(':groupId/user/:userId/role/:role')
  editUserRolesInGroup(@Param() params: UserToGroupDTO) {
    return this.groupService.editUserRolesInGroup(params);
  }

  // GET group history (member or public) <--- ver cuando tenga matches
}
