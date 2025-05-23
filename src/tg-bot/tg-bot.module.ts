import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';

@Module({
  providers: [TgBotService],
  exports: [TgBotService],
})
export class TgBotModule {}
