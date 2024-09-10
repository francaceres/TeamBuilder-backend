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

@Controller('groups/:groupId/players')
export class PlayersController {
  constructor(private playerService: PlayersService) {}

  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Post()
  createPlayer(@Body() dto: CreatePlayerDTO) {
    return this.playerService.createPlayer(dto);
  }

  @UseGuards(VisibilityBasedGroupAccessGuard)
  @Get('/:playerId')
  getPlayer(@Param('playerId') playerId: string) {
    return this.playerService.getPlayer(playerId);
  }

  @UseGuards(VisibilityBasedGroupAccessGuard)
  @Get()
  getPlayers(
    @Param('groupId') groupId: string,
    @Query() query: FindManyOptionsDTO,
  ) {
    return this.playerService.getPlayers(groupId, query);
  }

  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Patch('/:playerId')
  updatePlayer(
    @Param('playerId') playerId: string,
    @Body() dto: UpdatePlayerDTO,
  ) {
    return this.playerService.updatePlayer(playerId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Delete('/:playerId')
  deletePlayer(@Param('playerId') playerId: string) {
    return this.playerService.deletePlayer(playerId);
  }
}
