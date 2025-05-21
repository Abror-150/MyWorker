import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class FindAllShowcaseDto {
  @ApiPropertyOptional({ example: 'asbob', description: 'Nomi bo‘yicha qidirish' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: SortOrder, example: 'asc', description: 'Saralash tartibi' })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @ApiPropertyOptional({ example: 'name_uz', description: 'Saralash ustuni' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 1, description: 'Sahifa raqami' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Har sahifadagi elementlar soni' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
