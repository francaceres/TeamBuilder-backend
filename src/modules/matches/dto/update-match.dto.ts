import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsOptional,
} from 'class-validator';
import { UpdateTeamDTO } from '.';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TeamResults } from '@prisma/client';

export class UpdateMatchDTO {
  @ApiProperty({ description: "Match's date", example: new Date() })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiProperty({
    description: "Match's teams",
    example: [
      {
        name: 'Team A',
        result: TeamResults.WIN,
        score: 2,
        players: [
          { id: 'fa331b6c-8f31-4565-828f-f36da6627b45' },
          { name: 'John Doe' },
        ],
      },
      {
        name: 'Team B',
        result: TeamResults.LOSE,
        score: 0,
        players: [
          { id: '7dd334fc-467c-4f74-b39c-5081043bcc27' },
          { name: 'Jack Jackson' },
        ],
      },
    ],
  })
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  teams?: UpdateTeamDTO[];
}
