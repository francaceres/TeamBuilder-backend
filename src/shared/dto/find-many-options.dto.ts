import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FindManyOptionsDTO {
  @ApiProperty({
    description: 'String to filter results by',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiProperty({
    description: 'Date to filter results from',
    example: new Date(),
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'Date to filter results to',
    example: new Date(),
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ description: 'Pagination skip', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Pagination take', example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number;

  @ApiProperty({
    description: 'Property to sort results by',
    example: 'name',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    description: 'Order to sort results by',
    example: SortOrder.ASC,
    enum: SortOrder,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
