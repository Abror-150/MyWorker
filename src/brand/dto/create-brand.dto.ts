import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Bosch', description: 'Name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Бош',
    description: 'Name in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({
    example: 'Bosch',
    description: 'Name in English',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;
}
