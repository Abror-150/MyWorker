import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'lorem',
    }),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
