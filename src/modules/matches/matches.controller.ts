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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AdminRoleSwaggerDescription,
  VisibilitySwaggerDescription,
} from 'src/shared/constants';

@ApiTags('Matches')
@Controller('/groups/:groupId/matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Creates a match with two teams, also creates players if non-registered players are selected',
    description: AdminRoleSwaggerDescription,
  })
  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @Post()
  createMatch(@Param('groupId') groupId: string, @Body() dto: CreateMatchDTO) {
    return this.matchesService.createMatch(groupId, dto);
  }

  @ApiOperation({
    summary: 'Gets one match',
    description: VisibilitySwaggerDescription,
  })
  @UseGuards(VisibilityBasedGroupAccessGuard)
  @Get('/:matchId')
  getMatch(@Param('matchId') matchId: string) {
    return this.matchesService.getMatch(matchId);
  }

  @ApiOperation({
    summary: 'Gets matches from a determined group',
    description: VisibilitySwaggerDescription,
  })
  @ApiResponse({
    status: 200,
    example: {
      totalCount: 50,
      matches: ['match1', 'match2'],
      page: 1,
      pageSize: 2,
    },
  })
  @UseGuards(VisibilityBasedGroupAccessGuard)
  @Get()
  getMatches(
    @Param('groupId') groupId: string,
    @Query() query: FindManyOptionsDTO,
  ) {
    return this.matchesService.getMatches(groupId, query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Updates a match',
    description: AdminRoleSwaggerDescription,
  })
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deletes a match',
    description: AdminRoleSwaggerDescription,
  })
  @UseGuards(JwtAuthGuard, RoleBasedGroupAccessGuard)
  @GroupRoles([UserInGroupRole.ADMIN, UserInGroupRole.OWNER])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:matchId')
  deleteMatch(@Param('matchId') matchId: string) {
    return this.matchesService.deleteMatch(matchId);
  }
}
