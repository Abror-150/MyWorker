import { ApiProperty } from '@nestjs/swagger';
import { orderTime } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateBasketItemDto {
  @ApiProperty({
    description: 'Mahsulot IDsi',
    example: '243c0c12-0a41-4667-bb56-5549e101a09e',
  })
  @IsOptional()
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Daraja (level) IDsi',
    example: '5551e759-0cc2-4b9d-9716-fbe447ce979f',
  })
  @IsOptional()
  @IsUUID()
  levelId: string;

  @ApiProperty({
    description: 'Nechta soat yoki dona tanlandi',
    example: 3,
  })
  @IsInt()
  count: number;

  @ApiProperty({
    description: 'Ishlash vaqti (soatda)',
    example: 2,
  })
  @IsInt()
  workingTime: number;
  @ApiProperty({ example: orderTime.HOUR })
  @IsNotEmpty()
  @IsEnum(orderTime)
  timeUnit: orderTime;

  @ApiProperty({
    description: 'Asbob (tool) IDsi',
    example: 'b0421bc0-33f7-4992-b17c-d831161160bd',
  })
  @IsOptional()
  @IsUUID()
  toolId: string;
}
