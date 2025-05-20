import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({ example: 'Boshlang‘ich', description: 'Name in Uzbek' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Начальный',
    description: 'Name in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({
    example: 'Beginner',
    description: 'Name in English',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;
}
