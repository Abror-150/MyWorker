import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Bu ishchilar yaxshi ishladi gap yoq' })
  message: string;
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  orderId: string;
}
