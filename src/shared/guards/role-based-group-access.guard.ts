import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { GroupRoles } from '../decorators';

@Injectable()
export class RoleBasedGroupAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(GroupRoles, context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const groupId = request.params.groupId;

    if (!user) throw new ForbiddenException('User not found');
    if (!groupId) throw new ForbiddenException('Group ID is required');

    const userInGroup = await this.prisma.userInGroup.findUnique({
      where: { userId_groupId: { userId: user.id, groupId } },
    });

    if (!userInGroup) return false;

    return roles.includes(userInGroup.role);
  }
}
