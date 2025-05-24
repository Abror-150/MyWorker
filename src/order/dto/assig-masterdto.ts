// assign-masters.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AssignMastersDto {
  @ApiProperty({ type: [String], example: ['baf48a01-64fc-4072-bf5c-b42748d6bd46'] })
  @IsArray()
  @IsUUID('all', { each: true })
  masterIds: string[];
}
