import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateStarDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  masterId: string;
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  star: number;
}
