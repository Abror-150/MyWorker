import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCapacityDto {
  @ApiProperty({ example: '128GB', description: 'Capacity size in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: '128ГБ',
    description: 'Capacity size in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({
    example: '128GB',
    description: 'Capacity size in English',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;
}
