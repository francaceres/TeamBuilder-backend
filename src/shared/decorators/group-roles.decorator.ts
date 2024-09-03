import { Reflector } from '@nestjs/core';
import { UserInGroupRole } from '@prisma/client';

export const GroupRoles = Reflector.createDecorator<UserInGroupRole[]>();
