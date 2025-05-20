// masterProduct.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, IsInt, IsNumber, Min } from 'class-validator';

export class MasterProductDto {
  @ApiProperty({ description: 'Product (kasb) ID', example: 'uuid-product-id' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Level ID', example: 'uuid-level-id' })
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
