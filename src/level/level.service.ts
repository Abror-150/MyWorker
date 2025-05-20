import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

interface FindAllLevelParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLevelDto: CreateLevelDto) {
    return this.prisma.level.create({
      data: createLevelDto,
    });
  }

  async findAll(params: FindAllLevelParams = {}) {
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
      'creadetAt',
    ];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    const where: any = {};
    if (search) {
      where.OR = [
        { name_uz: { contains: search, mode: 'insensitive' } },
        { name_ru: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
      ];
    }

    const data = await this.prisma.level.findMany({
      where,
      orderBy: { [validSortBy]: validSortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.level.count({ where });

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
    const level = await this.prisma.level.findUnique({
      where: { id },
    });

    if (!level) {
      throw new NotFoundException('Level topilmadi');
    }

    return level;
  }

  async update(id: string, updateLevelDto: UpdateLevelDto) {
    await this.findOne(id);

    return this.prisma.level.update({
      where: { id },
      data: updateLevelDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.level.delete({
      where: { id },
    });
  }
}
