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
} from '@nestjs/common';
import { CreateMatchDTO, UpdateMatchDTO } from './dto';
import { MatchesService } from './matches.service';
import { FindManyOptionsDTO } from 'src/shared/dto';

@Controller('/groups/:groupId/matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Post()
  createMatch(@Param('groupId') groupId: string, @Body() dto: CreateMatchDTO) {
    return this.matchesService.createMatch(groupId, dto);
  }

  @Get('/:matchId')
  getMatch(@Param('matchId') matchId: string) {
    return this.matchesService.getMatch(matchId);
  }

  @Get()
  getMatches(
    @Param('groupId') groupId: string,
    @Query() query: FindManyOptionsDTO,
  ) {
    return this.matchesService.getMatches(groupId, query);
  }

  @Patch('/:matchId')
  updateMatch(
    @Param('groupId') groupId: string,
    @Param('matchId') matchId: string,
    @Body() dto: UpdateMatchDTO,
  ) {
    return this.matchesService.updateMatch(groupId, matchId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:matchId')
  deleteMatch(@Param('matchId') matchId: string) {
    return this.matchesService.deleteMatch(matchId);
  }
}
