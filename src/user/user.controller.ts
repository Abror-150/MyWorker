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
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserLoginDto } from './dto/createLogin-user. dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { emailDto } from './dto/createEmaildto';
import { otpDto } from './dto/create-user.dtootp copy';
import { AuthGuard } from 'src/guard/auth.guard';
import { request, Request } from 'express';
import { createAdmin } from './dto/create-admindto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RefreshTokendDto } from './dto/changed.user.dtoRefresh';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { Roles } from './decorators/rbuc.decorator';
import { userRole } from '@prisma/client';
import { ChangePasswordDto } from './dto/reset-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('sendEmail')
  create(@Body() data: emailDto) {
    return this.userService.sendEmail(data);
  }
  @Post('verifyEmail')
  verify(@Body() data: otpDto) {
    return this.userService.verifyEmail(data);
  }
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
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
  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: "Nechta yozuvni o'tkazib yuborish (pagination offset)",
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Nechta yozuv olish (pagination limit)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: "Qidiruv kalit so'zlari (fullName, email, phone)",
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: "Qaysi ustun bo'yicha tartiblash (default: fullName)",
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: "Tartib yo'nalishi (asc yoki desc, default: asc)",
  })
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.userService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      search,
      sortBy,
      sortOrder,
    });
  }

  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
  @UseGuards(AuthGuard)
  @Post('resetPassword')
  resetPassword(@Body() data: ChangePasswordDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.userService.ResetPassword(data, userId);
  }
  @UseGuards(AuthGuard)
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
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post('admin')
  addAdmin(@Body() data: createAdmin, @Req() req: Request) {
    const requesterRole = req['user-id'];
    if (requesterRole !== 'ADMIN') {
      throw new ForbiddenException("Faqat ADMIN yangi admin qo'sha oladi");
    }
    return this.userService.addAdmin(data, requesterRole);
  }

  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
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
