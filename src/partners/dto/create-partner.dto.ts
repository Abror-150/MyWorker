import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ description: "Partner's name in Uzbek" })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ description: "Partner's name in Russian" })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({ description: "Partner's name in English" })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({
    description: "Partner's image URL",
    example: '1744664398677.png',
  })
  @IsOptional()
  @IsString()
  image: string;
}
