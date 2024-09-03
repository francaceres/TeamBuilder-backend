import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDTO, UpdateGroupDTO } from './dto';
import { RequestUser } from 'src/shared/types';
import { UserToGroupDTO } from './dto/user-to-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async createGroup(dto: CreateGroupDTO, user: RequestUser) {
    return await this.prisma.group.create({
      data: {
        ...dto,
        users: {
          create: [{ userId: user.id, role: 'OWNER' }],
        },
      },
    });
  }

  async getGroupInfo(groupId: string) {
    return await this.prisma.group.findUniqueOrThrow({
      where: { id: groupId },
      select: {
        name: true,
        description: true,
        createdAt: true,
        visualization: true,
      },
    });
  }

  async updateGroup(groupId: string, dto: UpdateGroupDTO) {
    return await this.prisma.group.update({
      where: { id: groupId },
      data: { ...dto },
    });
  }

  async editUserRolesInGroup(dto: UserToGroupDTO) {
    const { groupId, userId, role } = dto;
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
}
