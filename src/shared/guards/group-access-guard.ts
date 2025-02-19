import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { GroupRoles } from '../decorators';
import {
  Group,
  GroupVisualization,
  UserInGroup,
  UserInGroupRole,
} from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { RequestUser } from '../types';

@Injectable()
export class GroupAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const groupId = request.params.groupId;
    if (!groupId) throw new ForbiddenException('Group ID is required');
    const group = await this.prisma.group.findUniqueOrThrow({
      where: { id: groupId },
      include: { users: true },
    });

    const authorizationHeader = request.headers.authorization;
    const user = await this.extractUserFromToken(authorizationHeader);
    const roles = this.reflector.get(GroupRoles, context.getHandler());

    if (!this.accessCheck(user, group, roles))
      throw new ForbiddenException(
        'You need appropiate permissions to do this task',
      );

    return true;
  }

  private async extractUserFromToken(
    authorizationHeader: string | undefined,
  ): Promise<any> {
    if (!authorizationHeader) return null;

    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return decoded;
    } catch (error) {
      return null;
    }
  }

  private async accessCheck(
    user: RequestUser | null,
    group: Group & { users: UserInGroup[] },
    roles?: UserInGroupRole[],
  ): Promise<boolean> {
    const isPrivate = group.visualization === GroupVisualization.PRIVATE;

    // Case 1: non authenticated user
    if (!user) {
      return !isPrivate && roles.length === 0;
    }

    // Case 2: private group
    if (isPrivate) {
      const isUserAssociated = group.users.some((u) => u.id === user.id);

      if (!isUserAssociated) {
        return false;
      }

      if (roles || roles.length === 0) {
        return true;
      }

      const userInGroup = await this.prisma.userInGroup.findUnique({
        where: { userId_groupId: { userId: user.id, groupId: group.id } },
        select: { role: true },
      });

      return userInGroup ? roles.includes(userInGroup.role) : false;
    }

    // Case 3: public group
    if (roles.length === 0) {
      return true;
    }

    const userInGroup = await this.prisma.userInGroup.findUnique({
      where: { userId_groupId: { userId: user.id, groupId: group.id } },
      select: { role: true },
    });

    return userInGroup ? roles.includes(userInGroup.role) : false;
  }
}
