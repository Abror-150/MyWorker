// create-company.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company Name',
    example: 'TechCorp LLC',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Company INN',
    example: '123456789',
  })
  @IsString()
  inn: string;

  @ApiProperty({
    description: 'Company Account Number',
    example: 'UA12345678901234567890123456',
  })
  @IsString()
  account: string;

  @ApiProperty({
    description: 'Company Address',
    example: '123 Tech Street, Tashkent, Uzbekistan',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Bank Name (Optional)',
    example: 'TechBank',
    required: false,
  })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiProperty({
    description: 'MFO Code (Optional)',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  mfo?: string;
}
