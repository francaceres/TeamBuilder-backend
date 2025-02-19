import { IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMatchDTO } from '.';

export class CreateMatchRequestDTO {
  @IsUUID()
  groupId: string;

  @ValidateNested()
  @Type(() => CreateMatchDTO)
  match: CreateMatchDTO;
}
