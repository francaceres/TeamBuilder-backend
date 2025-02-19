import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDTO, UpdateGroupDTO } from './dto';
import { RequestUser } from 'src/shared/types';
import { Group, Prisma, UserInGroupRole } from '@prisma/client';
import { FindManyOptionsDTO, SortOrder } from 'src/shared/dto';
import { FindManyResponseDTO } from 'src/shared/dto/find-many-response.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async createGroup(dto: CreateGroupDTO, user: RequestUser) {
    return await this.prisma.group.create({
      data: {
        ...dto,
        users: { create: [{ userId: user.id, role: UserInGroupRole.OWNER }] },
      },
    });
  }

  async getMyGroups(
    user: RequestUser,
    query: FindManyOptionsDTO,
  ): Promise<FindManyResponseDTO<Group>> {
    const {
      filter,
      page = 1,
      pageSize = 10,
      sortBy = 'name',
      sortOrder = SortOrder.ASC,
    } = query;

    const where: Prisma.GroupWhereInput = {
      users: { some: { userId: user.id } },
    };

    if (filter) {
      where.name = { contains: filter, mode: 'insensitive' };
    }

    const orderBy: Prisma.GroupOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const groups = await this.prisma.group.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        matches: {
          orderBy: { date: 'asc' },
          take: 1,
          include: { teams: true },
        },
        users: { include: { user: { select: { name: true } } } },
      },
    });

    const totalCount = await this.prisma.group.count({
      where,
    });

    return {
      totalCount,
      data: groups,
      page,
      pageSize,
    };
  }

  async getGroupInfo(groupId: string, user: RequestUser | null) {
    const group = await this.prisma.group.findUniqueOrThrow({
      where: { id: groupId },
      select: {
        name: true,
        description: true,
        createdAt: true,
        visualization: true,
        _count: { select: { users: true, matches: true, players: true } },
      },
    });

    let canEdit = false;
    let isAssociated = false;

    if (user) {
      const userInGroup = await this.prisma.userInGroup.findUnique({
        where: {
          userId_groupId: { userId: user.id, groupId },
        },
        select: { role: true },
      });
      if (userInGroup) {
        isAssociated = true;
      }
      if (
        userInGroup.role === UserInGroupRole.ADMIN ||
        userInGroup.role === UserInGroupRole.OWNER
      ) {
        canEdit = true;
      }
    }

    return { ...group, canEdit, isAssociated };
  }

  async updateGroup(groupId: string, dto: UpdateGroupDTO) {
    return await this.prisma.group.update({
      where: { id: groupId },
      data: { ...dto },
    });
  }

  async editUserRolesInGroup(
    groupId: string,
    userId: string,
    role: UserInGroupRole,
    currentUser: RequestUser,
  ) {
    if (role === UserInGroupRole.OWNER) {
      const userInGroup = await this.prisma.userInGroup.findUnique({
        where: {
          userId_groupId: { userId: currentUser.id, groupId },
          role: UserInGroupRole.OWNER,
        },
      });
      if (!userInGroup) throw new ForbiddenException();
    }

    return await this.prisma.group.update({
      where: { id: groupId },
      data: {
        users: {
          upsert: {
            where: { userId_groupId: { userId, groupId } },
            create: {
              role,
              userId,
            },
            update: {
              role,
            },
          },
        },
      },
    });
  }

  async deleteGroup(groupId: string) {
    await this.prisma.group.update({
      where: { id: groupId },
      data: { users: { deleteMany: {} } },
    });
    await this.prisma.group.delete({ where: { id: groupId } });
    return;
  }

  async checkGroupsToBeEmptied(userId: string) {
    const groupsWithUser = await this.prisma.group.findMany({
      where: { users: { some: { userId } } },
      include: { users: true },
    });

    const groupsToBeEmptied = groupsWithUser.filter(
      (group) => group.users.length === 1,
    );

    return { groupsToBeEmptied };
  }
}
