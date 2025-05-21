import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderProductDto } from './create-order.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    example: { lat: '41.31', long: '69.21' },
    description: 'Buyurtma yetkaziladigan joy koordinatalari (ixtiyoriy)',
  })
  @IsOptional()
  location?: { lat: string; long: string };

  @ApiProperty({
    example: 'Tashkent, Chorsu street',
    description: 'Buyurtma manzili',
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    example: '2025-05-21T06:35:04.035Z',
    description: 'Buyurtma sanasi (ISO formatda)',
  })
  @IsOptional()
  @IsString()
  date: string;

  @ApiProperty({
    example: 'card',
    description: 'To‘lov turi: "card" yoki "cash"',
  })
  @IsOptional()
  @IsString()
  paymentType: string;

  @ApiPropertyOptional({
    example: 'Please be careful with delivery',
    description: 'Yetkazuvchiga izoh (ixtiyoriy)',
  })
  @IsOptional()
  @IsString()
  commentToDelivery?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Yetkazib berish bilanmi yoki yo‘qmi (ixtiyoriy)',
  })
  @IsOptional()
  withDelivery?: boolean;

  @ApiProperty({
    example: 'IN_PROGRESS',
    description:
      'Buyurtma holati (masalan: "IN_PROGRESS", "COMPLETED", "CANCELLED")',
  })
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty({
    type: [OrderProductDto],
    description: 'Buyurtmadagi mahsulotlar ro‘yxati',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  orderProducts: OrderProductDto[];

  @ApiPropertyOptional({
    type: [String],
    example: ['a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'],
    description: 'Biriktirilgan masterlar IDlari (ixtiyoriy)',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  masters?: string[];
}
