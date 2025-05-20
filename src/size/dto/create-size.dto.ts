import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty({ example: 'Kichik', description: 'Size name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Маленький',
    description: 'Size name in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({
    example: 'Small',
    description: 'Size name in English',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;
}
