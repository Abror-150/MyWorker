import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({
    example: 'Qanday qilib ro‘yxatdan o‘tiladi?',
    description: 'Savol matni',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    example: 'Telefon raqamingizni kiriting va OTP kodini tasdiqlang.',
    description: 'Savolga javob matni',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
