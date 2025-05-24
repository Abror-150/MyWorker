import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsUUID,
  isNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProfessionLevelDto } from './create-productLevel.dto';

export class ConnectRelationDto {
  @IsUUID()
  @ApiProperty({ example: 'uuid-id-value', description: 'Related entity ID' })
  id: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Tozalov ishlari', description: 'Name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Уборка',
    description: 'Name in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({
    example: 'cleaning work',
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
    example: 1,
    description: 'ishlash vaqti',
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  minWorkingHours?: number;

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
    example: ["b0421bc0-33f7-4992-b17c-d831161160bd"],
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
