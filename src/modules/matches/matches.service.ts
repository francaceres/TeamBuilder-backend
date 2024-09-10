import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDTO, UpdateMatchDTO } from './dto';
import { FindManyOptionsDTO } from 'src/shared/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async createMatch(groupId: string, dto: CreateMatchDTO) {
    return this.prisma.match.create({
      data: {
        date: dto.date,
        group: { connect: { id: groupId } },
        teams: {
          create: dto.teams.map((teamDto) => ({
            ...teamDto,
            players: {
              connect: teamDto.players
                .filter((playerDto) => !!playerDto.id)
                .map((playerDto) => ({ id: playerDto.id })),
              create: teamDto.players
                .filter((playerDto) => !playerDto.id)
                .map((playerDto) => ({
                  name: playerDto.name,
                  group: { connect: { id: groupId } },
                })),
            },
          })),
        },
      },
      include: {
        teams: {
          include: {
            players: true,
          },
        },
      },
    });
  }

  async getMatch(matchId: string) {
    return await this.prisma.match.findUniqueOrThrow({
      where: { id: matchId },
      include: { teams: { include: { players: true } } },
    });
  }

  async getMatches(groupId: string, query: FindManyOptionsDTO) {
    const { startDate, endDate = new Date(), page = 1, pageSize = 10 } = query;

    const where: Prisma.MatchWhereInput = { groupId, date: { lte: endDate } };

    if (startDate) {
      where.date = { lte: endDate, gte: startDate };
    }

    const matches = await this.prisma.match.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { teams: true },
    });

    const totalCount = await this.prisma.match.count({
      where,
    });

    return {
      totalCount,
      matches,
      page,
      pageSize,
    };
  }

  async updateMatch(groupId: string, matchid: string, dto: UpdateMatchDTO) {
    return await this.prisma.match.update({
      where: { id: matchid },
      data: {
        ...dto,
        teams: dto.teams && {
          update: dto.teams.map((teamDto) => ({
            where: { id: teamDto.id },
            data: {
              ...teamDto,
              players: teamDto.players && {
                set: teamDto.players
                  .filter((playerDto) => !!playerDto.id)
                  .map((playerDto) => ({ id: playerDto.id })),
                connect: teamDto.players
                  .filter((playerDto) => !!playerDto.id)
                  .map((playerDto) => ({ id: playerDto.id })),
                create: teamDto.players
                  .filter((playerDto) => !playerDto.id)
                  .map((playerDto) => ({
                    name: playerDto.name,
                    group: {
                      connect: { id: groupId },
                    },
                  })),
              },
            },
          })),
        },
      },
      include: {
        teams: {
          include: {
            players: true,
          },
        },
      },
    });
  }

  async deleteMatch(matchId: string) {
    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        teams: { deleteMany: {} },
      },
    });
    await this.prisma.match.delete({ where: { id: matchId } });
    return;
  }
}
