import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { CreateUserLoginDto } from './dto/createLogin-user. dto';
import { instanceToPlain } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { totp } from 'otplib';
import { MailService } from './mail/mail.service';
import { emailDto } from './dto/createEmaildto';
import { otpDto } from './dto/create-user.dtootp copy';
import { log } from 'console';
import { userRole } from '@prisma/client';
import { createAdmin } from './dto/create-admindto';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/reset-password.dto';
import { RefreshTokendDto } from './dto/changed.user.dtoRefresh';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
  ) {}

  async sendEmail(data: emailDto) {
    totp.options = { step: 600, digits: 4 };
    let { email } = data;

    let otp = totp.generate(email + 'email');
    await this.mail.sendEmail(email, 'otp yuborildi', otp);
    return { message: 'emailga yuborildi' };
  }

  async verifyEmail(data: otpDto) {
    const { email, otp } = data;

    if (!email) throw new NotFoundException('Email topilmadi');

    const match = totp.verify({ token: otp, secret: email + 'email' });
    if (!match) throw new BadRequestException('OTP noto‘g‘ri');

    await this.prisma.verifiedEmail.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return { message: 'Email tasdiqlandi' };
  }

  async register(data: CreateUserDto) {
    const verified = await this.prisma.verifiedEmail.findUnique({
      where: { email: data.email },
    });
    if (!verified) {
      throw new BadRequestException('Iltimos, avval emailni tasdiqlang');
    }
    const allowedRoles = [userRole.USER_YUR, userRole.USER_FIZ] as const;
    type AllowedRole = (typeof allowedRoles)[number];

    if (!allowedRoles.includes(data.role as AllowedRole)) {
      throw new BadRequestException(
        'Faqat USER_YUR yoki USER_FIZ bo‘lishi mumkin',
      );
    }

    let existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('foydalanuvchi allaqachon royhatdan otgan');
    }

    const region = await this.prisma.region.findFirst({
      where: { id: data.regionId },
    });
    if (!region) {
      throw new BadRequestException('Bunday region mavjud emas');
    }
    let hash = bcrypt.hashSync(data.password, 10);
    let newUser = await this.prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hash,
        role: data.role,
        regionId: data.regionId,
        company:
          data.role === 'USER_YUR' && data.company
            ? {
                create: data.company.map((company) => ({
                  name: company.name,
                  inn: company.inn,
                  account: company.account,
                  address: company.address,
                  bank: company.bank,
                  mfo: company.mfo,
                })),
              }
            : undefined,
      },
      include: { company: true },
    });
    return newUser;
  }

  async login(data: CreateUserLoginDto, request: Request) {
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('user topilmadi ');
    }
    let match = bcrypt.compareSync(data.password, user.password);
    if (!match) {
      throw new BadRequestException('parol xato');
    }
    const accessToken = this.jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      { expiresIn: '1h' },
    );

    const refreshToken = this.jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      { expiresIn: '7d' },
    );
    let device = request.headers['user-agent'] as string;

    let ip = request.ip as string;

    let userSession = await this.prisma.sesion.findFirst({
      where: { userId: user.id },
    });

    let session = await this.prisma.sesion.findFirst({ where: { ip } });
    if (!userSession || !session) {
      await this.prisma.sesion.create({
        data: {
          ip: ip,
          device: device,
          User: {
            connect: { id: user.id },
          },
        },
      });
    }

    return { accessToken, refreshToken };
  }
  async me(userId: string) {
    try {
      let user = await this.prisma.user.findFirst({
        where: { id: userId },
        include: {
          Region: true,
          order: true,
          comment: true,
          company: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User topilmadi');
      }
      return { user };
    } catch (error) {
      throw new Error(`Xatolik: ${error.message}`);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      skip = 0,
      take = 10,
      search,
      sortBy = 'fullName',
      sortOrder = 'asc',
    } = params;

    const where: any = search
      ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        regionId: true,
      },
    });

    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async getSessions(userId: string) {
    const sessions = await this.prisma.sesion.findMany({
      where: { userId: userId },
    });

    if (!sessions || sessions.length == 0) {
      throw new NotFoundException('Sessiyalar topilmadi');
    }

    return { sessions };
  }

  async deleteSession(sessionId: string, userId: string) {
    const session = await this.prisma.sesion.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Sessiya topilmadi');
    }

    await this.prisma.sesion.delete({
      where: {
        id: session.id,
      },
    });

    return { message: 'session deleted' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const data = instanceToPlain(updateUserDto);
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  async refresh(data: RefreshTokendDto) {
    try {
      if (!data.refreshToken) {
        return { message: 'refresh token xato ' };
      }
      let user = this.jwt.verify(data.refreshToken);

      const newAccestoken = this.jwt.sign({ id: user.id, role: user.role });
      return { newAccestoken };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Refresh token yaroqsiz');
      }
    }
  }
  async ResetPassword(dto: ChangePasswordDto, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user) {
      throw new Error('email  topilmadi');
    }

    const hashedPassword = bcrypt.hashSync(dto.newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: 'Parol yangilandi' };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return this.prisma.user.delete({ where: { id } });
  }

  private readonly allowedAdminRoles = ['ADMIN', 'SUPER_ADMIN', 'VIEWER_ADMIN'];

  async addAdmin(data: createAdmin, requesterRole: string) {
    // if (requesterRole != 'SUPER_ADMIN' && requesterRole != 'ADMIN') {
    //   throw new ForbiddenException(
    //     "Faqat SUPER_ADMIN YOKI ADMIN yangi admin YOKI super admin yoki VIEWER_ADMIN  qo'sha oladi",
    //   );
    // }

    // if (!this.allowedAdminRoles.includes(data.role)) {
    //   throw new BadRequestException(
    //     "Role faqat ADMIN, SUPER_ADMIN yoki VIEWER_ADMIN bo'lishi mumkin",
    //   );
    // }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Bu email bilan foydalanuvchi allaqachon mavjud',
      );
    }
    const existingUser2 = await this.prisma.user.findFirst({
      where: { phone: data.phone },
    });
    if (existingUser2) {
      throw new BadRequestException(
        'Bu phone bilan foydalanuvchi allaqachon mavjud',
      );
    }

    const region = await this.prisma.region.findFirst({
      where: { id: data.regionId },
    });
    if (!region) {
      throw new BadRequestException('Bunday region mavjud emas');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newAdmin = await this.prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role,
        regionId: data.regionId,
      },
    });

    return newAdmin;
  }

  async deleteAdmin(id: string, requesterRole: string) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id },
    });

    // if (!targetUser) {
    //   throw new NotFoundException('Bunday admin topilmadi');
    // }

    // const targetRole = targetUser.role;

    // const permissions: Record<string, string[]> = {
    //   ADMIN: ['SUPER_ADMIN', 'VIEWER_ADMIN'],
    //   SUPER_ADMIN: ['VIEWER_ADMIN'],
    //   VIEWER_ADMIN: [],
    // };

    // const allowedRoles = permissions[requesterRole];

    // if (!allowedRoles || !allowedRoles.includes(targetRole)) {
    //   throw new ForbiddenException(
    //     `Siz ${targetRole} roliga ega foydalanuvchini o‘chira olmaysiz`,
    //   );
    // }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
