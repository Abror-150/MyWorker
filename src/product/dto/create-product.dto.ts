import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProfessionLevelDto } from './create-productLevel.dto';

export class ConnectRelationDto {
  @IsUUID()
  @ApiProperty({ example: 'uuid-id-value', description: 'Related entity ID' })
  id: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Mahsulot nomi (uz)', description: 'Name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Название продукта',
    description: 'Name in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({
    example: 'Product name',
    description: 'Name in English',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({
    example: true,
    description: 'Is the product active?',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'List of tool IDs to connect',
    example: ['toolId1', 'toolId2'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  productTool?: string[];

  @ApiProperty({
    type: [ProfessionLevelDto],
    required: false,
    description: 'List of level IDs to connect',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfessionLevelDto)
  productLevel?: ProfessionLevelDto[];
}
