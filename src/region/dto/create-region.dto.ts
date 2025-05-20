import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty({ example: 'Toshkent', description: 'Name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Ташкент',
    description: 'Name in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'Name in English',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;
}
