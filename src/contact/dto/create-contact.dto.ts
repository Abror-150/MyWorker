import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ description: 'Foydalanuvchining ismi', example: 'John' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Foydalanuvchining familiyasi', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  surName: string;

  @ApiProperty({
    description: 'Foydalanuvchining telefon raqami',
    example: '+998900000000',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ', { message: 'Telefon raqami noto‘g‘ri' })
  phone: string;

  @ApiProperty({
    description: 'Foydalanuvchining manzili',
    example: 'Tashkent, Uzbekistan',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Foydalanuvchidan kelgan xabar',
    example: 'Yordam kerak.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
