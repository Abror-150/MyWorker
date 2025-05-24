import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGeneralInfoDto } from './dto/create-general-info.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeneralInfo } from '@prisma/client';

@Injectable()
export class GeneralInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGeneralInfoDto: CreateGeneralInfoDto) {
    return await this.prisma.generalInfo.create({
      data: createGeneralInfoDto,
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: keyof GeneralInfo;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
    } = query;
  
    const skip = (page - 1) * limit;
  
    const where:any = search
      ? {
          OR: [
            { phone: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
            { telegram: { contains: search, mode: 'insensitive' } },
            { instagram: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};
  
    const [data, total] = await this.prisma.$transaction([
      this.prisma.generalInfo.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.generalInfo.count({ where }),
    ]);
  
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  

  async findOne(id: string) {
    const generalInfo = await this.prisma.generalInfo.findUnique({
      where: { id },
    });
    if (!generalInfo) {
      throw new NotFoundException(`GeneralInfo ${id} topilmadi`);
    }
    return generalInfo;
  }

  async update(id: string, updateGeneralInfoDto: UpdateGeneralInfoDto) {
    const generalInfo = await this.prisma.generalInfo.findUnique({
      where: { id },
    });
    if (!generalInfo) {
      throw new NotFoundException(`GeneralInfo ${id} topilmadi`);
    }
    return await this.prisma.generalInfo.update({
      where: { id },
      data: updateGeneralInfoDto,
    });
  }

  async remove(id: string) {
    const generalInfo = await this.prisma.generalInfo.findUnique({
      where: { id },
    });
    if (!generalInfo) {
      throw new NotFoundException(`GeneralInfo ${id} topilmadi`);
    }
    return await this.prisma.generalInfo.delete({
      where: { id },
    });
  }
}
