import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateShowcaseDto {
  @ApiProperty({
    example: 'Asboblar to‘plami',
    description: 'Showcase nomi (uzbekcha)',
  })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiPropertyOptional({
    example: 'Набор инструментов',
    description: 'Showcase nomi (ruscha)',
  })
  @IsString()
  @IsOptional()
  name_ru?: string;

  @ApiPropertyOptional({
    example: 'Tool Set',
    description: 'Showcase nomi (inglizcha)',
  })
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiPropertyOptional({
    example: 'To‘plam haqida tavsif',
    description: 'Tavsif (uzbekcha)',
  })
  @IsString()
  @IsOptional()
  desc_uz?: string;

  @ApiPropertyOptional({
    example: 'Описание набора',
    description: 'Tavsif (ruscha)',
  })
  @IsString()
  @IsOptional()
  desc_ru?: string;

  @ApiPropertyOptional({
    example: 'Description of the set',
    description: 'Tavsif (inglizcha)',
  })
  @IsString()
  @IsOptional()
  desc_en?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Rasm URL manzili',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiPropertyOptional({
    example: 'https://example.com',
    description: 'Showcase linki',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  link?: string;
}
