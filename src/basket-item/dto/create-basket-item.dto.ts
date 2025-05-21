import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID } from 'class-validator';

export class CreateBasketItemDto {
  @ApiProperty({
    description: 'Mahsulot IDsi',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Daraja (level) IDsi',
    example: 'b183f4bc-2c23-4a59-bdac-e4c0f2c5f4a8',
  })
  @IsUUID()
  levelId: string;

  @ApiProperty({
    description: 'Nechta soat yoki dona tanlandi',
    example: 3,
  })
  @IsInt()
  count: number;

  @ApiProperty({
    description: 'Ishlash vaqti (soatda)',
    example: 2,
  })
  @IsInt()
  workingTime: number;

  @ApiProperty({
    description: 'Asbob (tool) IDsi',
    example: 'f0c2bdf7-1234-4f7c-9876-0a8b7e5c0cde',
  })
  toolId: string;
}
