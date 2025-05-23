import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TgBotModule } from 'src/tg-bot/tg-bot.module';

@Module({
  imports:[TgBotModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
