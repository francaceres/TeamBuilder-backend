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
import { CreateMatchDTO, UpdateMatchDTO } from './dto';
import { MatchesService } from './matches.service';
import { FindManyOptionsDTO } from 'src/shared/dto';
import { JwtAuthGuard } from '../auth/guards';
import {
  RoleBasedGroupAccessGuard,
  VisibilityBasedGroupAccessGuard,
} from 'src/shared/guards';
import { GroupRoles } from 'src/shared/decorators';
import { UserInGroupRole } from '@prisma/client';

@Controller('/groups/:groupId/matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Post()
  createMatch(@Param('groupId') groupId: string, @Body() dto: CreateMatchDTO) {
    return this.matchesService.createMatch(groupId, dto);
  }

  @UseGuards(VisibilityBasedGroupAccessGuard)
  @Get('/:matchId')
  getMatch(@Param('matchId') matchId: string) {
    return this.matchesService.getMatch(matchId);
  }

  @UseGuards(VisibilityBasedGroupAccessGuard)
  @Get()
  getMatches(
    @Param('groupId') groupId: string,
    @Query() query: FindManyOptionsDTO,
  ) {
    return this.matchesService.getMatches(groupId, query);
  }

  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Patch('/:matchId')
  updateMatch(
    @Param('groupId') groupId: string,
    @Param('matchId') matchId: string,
    @Body() dto: UpdateMatchDTO,
  ) {
    return this.matchesService.updateMatch(groupId, matchId, dto);
  }

  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:matchId')
  deleteMatch(@Param('matchId') matchId: string) {
    return this.matchesService.deleteMatch(matchId);
  }
}
