import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { orderStatus, orderTime } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ToolDto {
  @ApiProperty({ example: '87ffa935-1ea4-491d-ac79-c16060d74aa3' })
  @IsOptional()
  @IsUUID()
  toolId: string;

  @ApiProperty({ example: 5 })
  @IsOptional()
  @IsNumber()
  count: number;
}

export class OrderProductDto {
  @ApiProperty({ example: 'ef779445-f0df-448f-9538-b90b192909d1' })
  @IsOptional()
  @IsUUID()
  productId: string;

  @ApiProperty({ example: '5551e759-0cc2-4b9d-9716-fbe447ce979f' })
  @IsOptional()
  @IsString()
  @IsUUID()
  levelId: string;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({ example: 30 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  workingTime: number;

  @ApiProperty({ example: orderTime.HOUR })
  @IsNotEmpty()
  @IsEnum(orderTime)
  timeUnit: orderTime;

  @ApiProperty({ type: [ToolDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ToolDto)
  tools: ToolDto[];
}

export class CreateOrderDto {
  @ApiProperty({ example: { lat: '41.31', long: '69.21' } })
  location: { lat: string; long: string };

  @ApiProperty({ example: 'Tashkent, Chorsu street' })
  @IsString()
  address: string;

  @ApiProperty({ example: new Date() })
  date: Date;

  @ApiProperty({ example: 'card' })
  @IsString()
  paymentType: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  withDelivery: boolean;

  @ApiProperty({ example: 'Please be careful with delivery' })
  @IsString()
  commentToDelivery?: string;

  // @ApiProperty({ example: orderStatus.IN_PROGRESS })
  // @IsEnum(orderStatus)
  // status: orderStatus;

  @ApiProperty({ type: [OrderProductDto] })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  orderProducts: OrderProductDto[];
}
