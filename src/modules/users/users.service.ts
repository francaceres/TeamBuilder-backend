import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDTO, UpdateEmailDTO, UpdatePasswordDTO } from './dto';
import * as argon from 'argon2';
import { RequestUser } from 'src/shared/types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(dto: CreateUserDTO) {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        hash,
      },
    });
    delete user.hash;
    return user;
  }

  async getMe(user: RequestUser) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: {
        name: true,
        email: true,
        createdAt: true,
        groups: { select: { role: true, group: true } },
      },
    });
  }

  async updateEmail(dto: UpdateEmailDTO, user: RequestUser) {
    await this.validateUser(user.id, dto.password);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { email: dto.newEmail },
    });
    delete updatedUser.hash;
    return updatedUser;
  }

  async updatePassword(dto: UpdatePasswordDTO, user: RequestUser) {
    await this.validateUser(user.id, dto.oldPassword);

    const hash = await argon.hash(dto.newPassword);
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { hash },
    });
    delete updatedUser.hash;
    return updatedUser;
  }

  async deleteUser(userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const groups = await prisma.group.findMany({
        where: {
          users: { some: { userId } },
        },
        include: { users: true },
      });

      const groupsToDelete = groups.filter((group) => group.users.length === 1);

      await prisma.group.deleteMany({
        where: {
          id: {
            in: groupsToDelete.map((group) => group.id),
          },
        },
      });

      await prisma.user.delete({
        where: { id: userId },
      });

      return;
    });
  }

  async validateUser(id: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    const pwMatches = await argon.verify(user.hash, password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
  }
}
