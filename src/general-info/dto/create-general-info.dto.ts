import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateGeneralInfoDto {
  @ApiProperty({
    description: 'Telefon raqam',
    example: '+998901234567',
  })
  @IsNotEmpty({ message: "Phone bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Phone matn ko'rinishida bo'lishi kerak" })
  @Matches(/^\+?\d{9,15}$/, { message: "Telefon raqam noto'g'ri formatda" })
  phone: string;

  @ApiProperty({
    description: 'Email manzil',
    example: 'example@mail.com',
  })
  @IsNotEmpty({ message: "Email bo'sh bo'lmasligi kerak" })
  @IsEmail({}, { message: "Email noto'g'ri formatda" })
  email: string;

  @ApiPropertyOptional({
    description: 'Manzil',
    example: 'Toshkent, Chorsu',
  })
  @IsOptional()
  @IsString({ message: "Address matn bo'lishi kerak" })
  address?: string;

  @ApiPropertyOptional({
    description: 'Telegram username',
    example: '@telegramuser',
  })
  @IsOptional()
  @IsString({ message: "Telegram matn bo'lishi kerak" })
  telegram?: string;

  @ApiPropertyOptional({
    description: 'Instagram username',
    example: '@instagramuser',
  })
  @IsOptional()
  @IsString({ message: "Instagram matn bo'lishi kerak" })
  instagram?: string;

  @ApiPropertyOptional({
    description: 'Tavsif (description)',
    example: "Bu yerga qisqacha kompaniya haqida ma'lumot yoziladi.",
  })
  @IsOptional()
  @IsString({ message: "Description matn bo'lishi kerak" })
  description?: string;
}
