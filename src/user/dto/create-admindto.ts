import { ApiProperty } from '@nestjs/swagger';
import { userRole } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class createAdmin {
  @ApiProperty({
    description: 'Admin F.I.O',
    example: 'Jane Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
  password: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @Matches(/^\+998\d{9}$/, {
    message: 'Telefon raqat togri formatda bolish kerak +998901234567',
  })
  phone: string;

  @ApiProperty({
    enum: [userRole.ADMIN, userRole.ADMIN],
    example: userRole.ADMIN,
  })
  @IsIn([userRole.ADMIN, userRole.SUPER_ADMIN, userRole.VIEWER_ADMIN])
  role: userRole;

  @ApiProperty({ example: 'd1e2f3g4-h5i6-j7k8-l9m0-n1o2p3q4r5s6' })
  @IsString()
  @IsNotEmpty()
  regionId: string;
}
