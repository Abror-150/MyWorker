import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { orderStatus, orderTime } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ToolDto {
  @ApiProperty({ example: 'tool-uuid-123' })
  @IsUUID()
  toolId: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  count: number;
}

export class OrderProductDto {
  @ApiProperty({ example: 'product-uuid-123' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 'uuid' })
  @IsString()
  @IsUUID()
  levelId: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  count: number;

  @ApiProperty({ example: orderStatus.IN_PROGRESS })
  @IsEnum(orderStatus)
  status: orderStatus;

  @ApiProperty({ example: 30 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: orderTime.HOUR })
  @IsEnum(orderTime)
  workingTime: orderTime;

  @ApiProperty({ type: [ToolDto] })
  @ValidateNested({ each: true })
  @Type(() => ToolDto)
  tools: ToolDto[];
}

export class MasterRatingDto {
  @ApiProperty({ example: 'master-uuid-3' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  star: number;
}

class CommentDto {
  @ApiProperty({ example: 'good' })
  @IsString()
  message: string;

  @ApiProperty({ type: [MasterRatingDto] })
  @ValidateNested({ each: true })
  @Type(() => MasterRatingDto)
  masters: MasterRatingDto[];
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
