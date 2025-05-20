// create-master.dto.ts

import {
    IsString,
    IsInt,
    IsOptional,
    IsBoolean,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    Min,
    IsUUID,
    IsNumber,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  import { Type } from 'class-transformer';
  import { MasterProductDto } from './masterProduct.dto';
  
  export class CreateMasterDto {
    @ApiProperty({ description: 'Master fullName', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    fullName: string;
  
    @ApiProperty({ description: 'Master telefon raqami', example: '+998900000000' })
    @IsString()
    @IsNotEmpty()
    phone: string;
  
    @ApiProperty({ description: 'Master tug‘ilgan yili', example: 1990 })
    @IsInt()
    @Min(1970)
    year: number;
  
    @ApiPropertyOptional({ description: 'Master faolligi', example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
  
    @ApiPropertyOptional({ description: 'Master rasmi URL', example: 'https://...' })
    @IsOptional()
    @IsString()
    img?: string;
  
    @ApiPropertyOptional({
      description: 'Master pasport rasmi URL',
      example: 'https://...',
    })
    @IsOptional()
    @IsString()
    passportImg?: string;
  
    @ApiProperty({ description: 'Master haqida ma’lumot', example: 'Tajribali mutaxassis' })
    @IsString()
    @IsNotEmpty()
    about: string;
  
    @ApiPropertyOptional({ type: [MasterProductDto], description: 'Kasb va daraja parametrlari' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MasterProductDto)
    masterProduct?: MasterProductDto[];
  }
  