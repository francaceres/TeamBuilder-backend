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
import { CreatePlayerDTO, UpdatePlayerDTO } from './dto';
import { PlayersService } from './players.service';
import { FindManyOptionsDTO } from 'src/shared/dto';
import {
  RoleBasedGroupAccessGuard,
  VisibilityBasedGroupAccessGuard,
} from 'src/shared/guards';
import { JwtAuthGuard } from '../auth/guards';
import { GroupRoles } from 'src/shared/decorators';
import { UserInGroupRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AdminRoleSwaggerDescription,
  VisibilitySwaggerDescription,
} from 'src/shared/constants';

@ApiTags('Players')
@Controller('groups/:groupId/players')
export class PlayersController {
  constructor(private playerService: PlayersService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creates a player associated to a group',
    description: AdminRoleSwaggerDescription,
  })
  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Post()
  createPlayer(
    @Param('groupId') groupId: string,
    @Body() dto: CreatePlayerDTO,
  ) {
    return this.playerService.createPlayer(groupId, dto);
  }

  @ApiOperation({
    summary: 'Gets a player info and matches',
    description: VisibilitySwaggerDescription,
  })
  @UseGuards(VisibilityBasedGroupAccessGuard)
  @Get('/:playerId')
  getPlayer(@Param('playerId') playerId: string) {
    return this.playerService.getPlayer(playerId);
  }

  @ApiOperation({
    summary: 'Gets all players from a group',
    description: VisibilitySwaggerDescription,
  })
  @UseGuards(VisibilityBasedGroupAccessGuard)
  @Get()
  getPlayers(
    @Param('groupId') groupId: string,
    @Query() query: FindManyOptionsDTO,
  ) {
    return this.playerService.getPlayers(groupId, query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Updates a player info',
    description: AdminRoleSwaggerDescription,
  })
  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Patch('/:playerId')
  updatePlayer(
    @Param('playerId') playerId: string,
    @Body() dto: UpdatePlayerDTO,
  ) {
    return this.playerService.updatePlayer(playerId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletes a player',
    description: AdminRoleSwaggerDescription,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Delete('/:playerId')
  deletePlayer(@Param('playerId') playerId: string) {
    return this.playerService.deletePlayer(playerId);
  }
}
