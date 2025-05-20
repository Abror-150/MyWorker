import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateToolDto {
  @ApiProperty({ example: 'Otvertka', description: 'Name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Отвертка',
    required: false,
    description: 'Name in Russian',
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({
    example: 'Screwdriver',
    required: false,
    description: 'Name in English',
  })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({ example: 'Oddiy otvertka', required: false })
  @IsOptional()
  @IsString()
  describtion_uz?: string;

  @ApiProperty({ example: 'Простая отвертка', required: false })
  @IsOptional()
  @IsString()
  describtion_ru?: string;

  @ApiProperty({ example: 'Basic screwdriver', required: false })
  @IsOptional()
  @IsString()
  describtion_en?: string;

  @ApiProperty({ example: 15000, description: 'Price in UZS' })
  @IsInt()
  price: number;

  @ApiProperty({ example: 25, description: 'Quantity in stock' })
  @IsInt()
  quantity: number;

  //   @ApiProperty({ example: 12345, description: 'Product code' })
  //   @IsInt()
  //   code: number;

  @ApiProperty({ example: 'uuid', required: false, description: 'Brand ID' })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiProperty({ example: 'uuid', required: false, description: 'Size ID' })
  @IsOptional()
  @IsUUID()
  sizeId?: string;

  @ApiProperty({ example: 'uuid', description: 'Capacity ID' })
  @IsUUID()
  capacityId: string;

  @ApiProperty({ example: 'https://example.com/tool.jpg', required: false })
  @IsOptional()
  @IsString()
  img?: string;
}
