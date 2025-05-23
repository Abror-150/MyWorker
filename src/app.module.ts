import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from './user/mail/mail.module';
import { RegionModule } from './region/region.module';
import { BrandModule } from './brand/brand.module';
import { SizeModule } from './size/size.module';
import { CapacityModule } from './capacity/capacity.module';
import { ProductModule } from './product/product.module';
import { ToolModule } from './tool/tool.module';
import { LevelModule } from './level/level.module';
import { MasterModule } from './master/master.module';
import { FaqModule } from './faq/faq.module';
import { OrderModule } from './order/order.module';
import { CommentModule } from './comment/comment.module';
import { GeneralInfoModule } from './general-info/general-info.module';
import { PartnersModule } from './partners/partners.module';
import { BasketItemModule } from './basket-item/basket-item.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { ContactModule } from './contact/contact.module';
import { TgBotService } from './tg-bot/tg-bot.service';
import { TgBotModule } from './tg-bot/tg-bot.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    MailModule,
    RegionModule,
    BrandModule,
    SizeModule,
    CapacityModule,
    ProductModule,
    ToolModule,
    LevelModule,
    MasterModule,
    FaqModule,
    OrderModule,
    CommentModule,
    GeneralInfoModule,
    PartnersModule,
    BasketItemModule,
    ShowcaseModule,
    ContactModule,
    TgBotModule,
  ],
  controllers: [AppController],
  providers: [AppService, TgBotService],
})
export class AppModule {}
