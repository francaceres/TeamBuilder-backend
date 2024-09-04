import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDTO, UpdatePlayerDTO } from './dto';
import { FindManyOptionsDTO, SortOrder } from 'src/shared/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async createPlayer(dto: CreatePlayerDTO) {
    const { groupId, ...data } = dto;
    return await this.prisma.player.create({
      data: {
        ...data,
        group: {
          connect: { id: groupId },
        },
      },
    });
  }

  async getPlayer(playerId: string) {
    return this.prisma.player.findUniqueOrThrow({
      where: { id: playerId },
      include: { teams: { include: { match: true } } },
    });
  }

  async getPlayers(groupId: string, query: FindManyOptionsDTO) {
    const {
      filter,
      page = 1,
      pageSize = 10,
      sortBy = 'name',
      sortOrder = SortOrder.ASC,
    } = query;

    const where: Prisma.PlayerWhereInput = { groupId };

    if (filter) {
      where.name = { contains: filter, mode: 'insensitive' };
    }

    const orderBy: Prisma.PlayerOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const players = await this.prisma.player.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.prisma.player.count({
      where,
    });

    return {
      totalCount,
      players,
      page,
      pageSize,
    };
  }

  async updatePlayer(playerId: string, dto: UpdatePlayerDTO) {
    return await this.prisma.player.update({
      where: { id: playerId },
      data: dto,
    });
  }

  async deletePlayer(playerId: string) {
    await this.prisma.player.delete({ where: { id: playerId } });
    return;
  }
}
