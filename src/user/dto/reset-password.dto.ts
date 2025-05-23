import { IsString, IsNotEmpty, Min, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Foydalanuvchini aniqlash uchun email',
    example: 'alex@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Foydalanuvchiga yangi parolni o‘rnatish',
    example: 'newSecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  newPassword: string;
}
