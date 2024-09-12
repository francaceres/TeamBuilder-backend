import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GroupVisualization } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class VisibilityBasedGroupAccessGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const groupId = request.params.groupId;

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { users: true },
    });

    if (!group) throw new NotFoundException('Group not found');

    if (group.visualization === GroupVisualization.PUBLIC) return true;

    const authorizationHeader = request.headers.authorization;
    const user = await this.extractUserFromToken(authorizationHeader);

    if (!user) {
      throw new ForbiddenException(
        'You need to be logged in to access this group',
      );
    }

    const isMember = group.users.some((member) => member.userId === user.sub);
    if (!isMember) {
      throw new ForbiddenException(
        'You do not have permission to view this group',
      );
    }

    return true;
  }

  private async extractUserFromToken(
    authorizationHeader: string | undefined,
  ): Promise<any> {
    if (!authorizationHeader) return null;

    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;

    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
