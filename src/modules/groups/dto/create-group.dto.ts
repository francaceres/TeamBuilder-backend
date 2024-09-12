import { ApiProperty } from '@nestjs/swagger';
import { GroupVisualization } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDTO {
  @ApiProperty({ description: 'Group name', example: 'Group 1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Group description', example: 'This is Group 1' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Groups' availability to users",
    enum: GroupVisualization,
  })
  @IsNotEmpty()
  @IsEnum(GroupVisualization)
  visualization: GroupVisualization;
}
