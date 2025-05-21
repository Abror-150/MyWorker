import { PartialType } from '@nestjs/swagger';
import { CreateBasketItemDto } from './create-basket-item.dto';

export class UpdateBasketItemDto extends PartialType(CreateBasketItemDto) {}
