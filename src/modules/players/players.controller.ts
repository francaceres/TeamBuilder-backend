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
import { CreatePlayerDTO, UpdatePlayerDTO } from './dto';
import { PlayersService } from './players.service';
import { FindManyOptionsDTO } from 'src/shared/dto';

@Controller('players')
export class PlayersController {
  constructor(private playerService: PlayersService) {}

  @Post()
  createPlayer(@Body() dto: CreatePlayerDTO) {
    return this.playerService.createPlayer(dto);
  }

  @Get('/:playerId')
  getPlayer(@Param('playerId') playerId: string) {
    return this.playerService.getPlayer(playerId);
  }

  @Get('/group/:groupId')
  getPlayers(
    @Param('groupId') groupId: string,
    @Query() query: FindManyOptionsDTO,
  ) {
    return this.playerService.getPlayers(groupId, query);
  }

  @Patch('/:playerId')
  updatePlayer(
    @Param('playerId') playerId: string,
    @Body() dto: UpdatePlayerDTO,
  ) {
    return this.playerService.updatePlayer(playerId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:playerId')
  deletePlayer(@Param('playerId') playerId: string) {
    return this.playerService.deletePlayer(playerId);
  }
}
