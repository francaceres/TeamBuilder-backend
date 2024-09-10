import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class MatchPlayerDTO {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @ValidateIf((o) => !o.id && !o.name)
  @IsNotEmpty({
    message: 'Either id or name must be provided for each player.',
  })
  validateAtLeastOne() {
    return !!(this.id || this.name);
  }
}
