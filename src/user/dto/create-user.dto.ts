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

  @ApiProperty({ example: 'john@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+998901232000' })
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

  @ApiProperty({ example: '5c03e643-9419-4aee-a87f-62c136dd63dd' })
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
