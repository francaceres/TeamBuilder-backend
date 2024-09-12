import { ApiProperty } from '@nestjs/swagger';
import { GroupVisualization } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDTO {
  @ApiProperty({ description: 'Group name', example: 'Group 1' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Group description', example: 'This is Group 1' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Groups' availability to users",
    enum: GroupVisualization,
  })
  @IsOptional()
  @IsEnum(GroupVisualization)
  visualization?: GroupVisualization;
}
