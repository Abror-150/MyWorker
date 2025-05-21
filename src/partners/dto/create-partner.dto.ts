import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ description: "Partner's name in Uzbek" })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ description: "Partner's name in Russian" })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ description: "Partner's name in English" })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({ description: "Partner's image URL" })
  @IsString()
  @IsNotEmpty()
  image: string;
}
