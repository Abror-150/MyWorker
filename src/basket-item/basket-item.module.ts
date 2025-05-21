import { Module } from '@nestjs/common';
import { BasketItemService } from './basket-item.service';
import { BasketItemController } from './basket-item.controller';

@Module({
  controllers: [BasketItemController],
  providers: [BasketItemService],
})
export class BasketItemModule {}
