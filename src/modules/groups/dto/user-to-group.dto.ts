import { UserInGroupRole } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class UserToGroupDTO {
  @IsUUID()
  groupId: string;

  @IsUUID()
  userId: string;

  @IsEnum(UserInGroupRole)
  role: UserInGroupRole;
}
