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

@Module({
  imports: [PrismaModule, UserModule, MailModule, RegionModule, BrandModule, SizeModule, CapacityModule, ProductModule, ToolModule, LevelModule, MasterModule, FaqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
