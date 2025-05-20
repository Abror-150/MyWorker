import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface FindAllSizeParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSizeDto: CreateSizeDto) {
    return this.prisma.size.create({
      data: createSizeDto,
    });
  }

  async findAll(params: FindAllSizeParams = {}) {
    const {
      search,
      sortBy = 'id',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = params;
    const allowedSortFields = [
      'id',
      'name_uz',
      'name_ru',
      'name_en',
      'createtAt',
    ];

    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const where: any = search
      ? {
          OR: [
            { name_uz: { contains: search, mode: 'insensitive' } },
            { name_ru: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const data = await this.prisma.size.findMany({
      where,
      orderBy: { [validSortBy]: validSortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.size.count({ where });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const size = await this.prisma.size.findUnique({
      where: { id },
    });
    if (!size) {
      throw new NotFoundException(`Size  id ${id} topilmadi`);
    }
    return size;
  }

  async update(id: string, updateSizeDto: UpdateSizeDto) {
    const size = await this.prisma.size.findFirst({ where: { id } });
    if (!size) {
      throw new NotFoundException(`Size  id ${id} topilmadi`);
    }
    return this.prisma.size.update({
      where: { id },
      data: updateSizeDto,
    });
  }

  async remove(id: string) {
    const size = await this.prisma.size.findFirst({ where: { id } });
    if (!size) {
      throw new NotFoundException(`Size  id ${id} topilmadi`);
    }
    return this.prisma.size.delete({
      where: { id },
    });
  }
}
