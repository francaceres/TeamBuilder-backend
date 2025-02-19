import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMatchDTO } from './dto';
import {
  FindManyOptionsDTO,
  FindManyResponseDTO,
  SortOrder,
} from 'src/shared/dto';
import { Match, Prisma } from '@prisma/client';
import { CreateMatchRequestDTO } from './dto/create-match-request.dto';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async createMatch(groupId: string, dto: CreateMatchRequestDTO) {
    return this.prisma.match.create({
      data: {
        date: dto.match.date,
        group: { connect: { id: groupId } },
        teams: {
          create: dto.match.teams.map((teamInMatchDto) => ({
            result: teamInMatchDto.result,
            score: teamInMatchDto.score,
            team: { connect: { id: teamInMatchDto.teamId } },
            players: {
              create: teamInMatchDto.players.map((playerInTeamDto) => ({
                player: { connect: { id: playerInTeamDto.playerId } },
              })),
            },
          })),
        },
      },
      include: {
        teams: {
          include: {
            team: true,
            players: {
              include: {
                player: true,
              },
            },
          },
        },
      },
    });
  }

  async getMatch(matchId: string) {
    return await this.prisma.match.findUniqueOrThrow({
      where: { id: matchId },
      include: {
        teams: {
          include: {
            team: {
              include: {
                match: { include: { players: { include: { player: true } } } },
              },
            },
          },
        },
      },
    });
  }

  async getMatches(
    groupId: string,
    query: FindManyOptionsDTO,
  ): Promise<FindManyResponseDTO<Match>> {
    const {
      startDate,
      endDate = new Date(),
      page = 1,
      pageSize = 10,
      sortBy = 'date',
      sortOrder = SortOrder.DESC,
    } = query;

    const where: Prisma.MatchWhereInput = { groupId, date: { lte: endDate } };

    if (startDate) {
      where.date = { lte: endDate, gte: startDate };
    }

    const orderBy: Prisma.MatchOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const matches = await this.prisma.match.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { teams: true },
    });

    const totalCount = await this.prisma.match.count({
      where,
    });

    return {
      totalCount,
      data: matches,
      page,
      pageSize,
    };
  }

  async updateMatch(matchId: string, updateMatchDTO: UpdateMatchDTO) {
    // Verificar si el partido existe
    const existingMatch = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { teams: true }, // Incluir los equipos asociados al partido
    });

    if (!existingMatch) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    // Usar una transacción para realizar todas las operaciones en una sola solicitud
    return this.prisma.$transaction(async (prisma) => {
      // Actualizar la fecha del partido si se proporciona
      if (updateMatchDTO.date) {
        await prisma.match.update({
          where: { id: matchId },
          data: { date: updateMatchDTO.date },
        });
      }

      // Actualizar los equipos y jugadores si se proporcionan
      if (updateMatchDTO.teams) {
        for (const teamUpdate of updateMatchDTO.teams) {
          // Verificar si el equipo está asociado al partido
          const existingTeamInMatch = existingMatch.teams.find(
            (team) => team.teamId === teamUpdate.id,
          );

          if (!existingTeamInMatch) {
            throw new NotFoundException(
              `Team with ID ${teamUpdate.id} is not associated with match ${matchId}`,
            );
          }

          // Actualizar el resultado y la puntuación del equipo en el partido
          await prisma.teamInMatch.update({
            where: { id: existingTeamInMatch.id },
            data: {
              result: teamUpdate.result,
              score: teamUpdate.score,
            },
          });

          // Actualizar los jugadores del equipo si se proporcionan
          if (teamUpdate.players) {
            await prisma.playerInTeam.updateMany({
              where: {
                teamInMatchId: existingTeamInMatch.id,
                playerId: { in: teamUpdate.players.map((p) => p.playerId) },
              },
              data: {
                isActive: true, // O cualquier otro campo que necesites actualizar
              },
            });
          }
        }
      }

      // Devolver el partido actualizado
      return prisma.match.findUnique({
        where: { id: matchId },
        include: {
          teams: {
            include: {
              team: true, // Incluir el equipo
              players: {
                include: {
                  player: true, // Incluir los jugadores
                },
              },
            },
          },
        },
      });
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
