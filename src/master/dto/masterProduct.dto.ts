// masterProduct.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, IsInt, IsNumber, Min, MinLength } from 'class-validator';

export class MasterProductDto {
  @ApiProperty({
    description: 'Product (kasb) ID',
    example: '3c7e35be-4032-458e-8d71-84dcb5e4b993',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Level ID',
    example: '5551e759-0cc2-4b9d-9716-fbe447ce979f',
  })
  @IsUUID()
  levelId: string;

  @ApiProperty({ description: 'Minimal ishlash soatlari', example: 4 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minWorkingHours: number;

  @ApiProperty({ description: 'Soatlik narx', example: 15000.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  priceHourly: number;

  @ApiProperty({ description: 'Kunlik narx', example: 100000 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  priceDaily: number;

  @ApiProperty({ description: 'Tajriba yillarda', example: 2.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  experience: number;
}
