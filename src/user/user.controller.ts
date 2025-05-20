import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserLoginDto } from './dto/createLogin-user. dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { emailDto } from './dto/createEmaildto';
import { otpDto } from './dto/create-user.dtootp copy';
import { AuthGuard } from 'src/guard/auth.guard';
import { Request } from 'express';
import { createAdmin } from './dto/create-admindto';
import { ApiOperation } from '@nestjs/swagger';
import { RefreshTokendDto } from './dto/changed.user.dtoRefresh';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
  @Post('sendEmail')
  create(@Body() data: emailDto) {
    return this.userService.sendEmail(data);
  }
  @Post('verifyEmail')
  verify(@Body() data: otpDto) {
    return this.userService.verifyEmail(data);
  }

  @Post('login')
  login(@Body() data: CreateUserLoginDto, @Req() req: Request) {
    return this.userService.login(data, req);
  }
  @Get('/sessions')
  @ApiOperation({ summary: 'Foydalanuvchining barcha sessiyalarini olish' })
  @UseGuards(AuthGuard)
  getSessions(@Req() req: Request) {
    const userId = req['user-id'];
    return this.userService.getSessions(userId);
  }
  @ApiOperation({ summary: "User barcha ma'lumotlarni olish" })
  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Req() req: Request) {
    const userId = req['user-id'];
    return this.userService.me(userId);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Delete('/session/:id')
  @ApiOperation({ summary: "Foydalanuvchining sessiyasini o'chirish" })
  @UseGuards(AuthGuard)
  deleteSession(@Param('id') sessionId: string, @Req() req: Request) {
    const userId = req['user-id'];
    return this.userService.deleteSession(sessionId, userId);
  }
  @Post('refreshToken')
  async refreshToken(@Body() data: RefreshTokendDto) {
    return this.userService.refresh(data);
  }

  @UseGuards(AuthGuard)
  @Post('admin')
  addAdmin(@Body() data: createAdmin, @Req() req: Request) {
    const requesterRole = req['user-id'];
    if (requesterRole !== 'ADMIN') {
      throw new ForbiddenException("Faqat ADMIN yangi admin qo'sha oladi");
    }
    return this.userService.addAdmin(data, requesterRole);
  }

  @UseGuards(AuthGuard)
  @Delete('admin/:id')
  deleteAdmin(@Param('id') id: string, @Req() req: Request) {
    const requesterRole = req['user-role'];
    if (requesterRole !== 'ADMIN') {
      throw new ForbiddenException("Faqat ADMIN adminni o'chira oladi");
    }
    return this.userService.deleteAdmin(id, requesterRole);
  }
}
