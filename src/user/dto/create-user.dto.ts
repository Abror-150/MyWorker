import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { userRole } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateNested,
  Matches,
  IsIn,
  MinLength,
} from 'class-validator';
import { CreateCompanyDto } from './create-companyDto';

export class CreateUserDto {
  @ApiProperty({
    description: 'User F.I.O',
    example: 'Jane Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @Matches(/^\+998\d{9}$/, {
    message: "Telefon raqam togri formatda bo'lish kerak  +998901234567",
  })
  phone: string;

  @ApiProperty({
    enum: [userRole.USER_FIZ, userRole.USER_YUR],
    example: userRole.USER_FIZ,
  })
  @IsIn([userRole.USER_FIZ, userRole.USER_YUR])
  role: userRole;

  @ApiProperty({ example: 'd1e2f3g4-h5i6-j7k8-l9m0-n1o2p3q4r5s6' })
  @IsString()
  @IsNotEmpty()
  regionId: string;

  @ApiPropertyOptional({ type: [CreateCompanyDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompanyDto)
  company?: CreateCompanyDto[];
}
