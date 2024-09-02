import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDTO } from './dto';
import * as argon from 'argon2';

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
}
