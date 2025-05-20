import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CapacityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCapacityDto: CreateCapacityDto) {
    return this.prisma.capacity.create({
      data: createCapacityDto,
    });
  }

  async findAll(query: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: any;
    limit?: any;
  }) {
    const {
      search,
      sortBy = 'id',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = query;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const allowedSortFields = [
      'id',
      'name_uz',
      'name_ru',
      'name_en',
      'createtAt',
    ];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    const where: any = search
      ? {
          OR: [
            { name_uz: { contains: search, mode: 'insensitive' } },
            { name_ru: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const capacities = await this.prisma.capacity.findMany({
      where,
      orderBy: { [validSortBy]: validSortOrder },
      skip: Number(pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const total = await this.prisma.capacity.count({ where });

    return {
      data: capacities,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const capacity = await this.prisma.capacity.findUnique({
      where: { id },
    });

    if (!capacity) {
      throw new NotFoundException(`Capacity  id ${id} topilmadi`);
    }

    return capacity;
  }

  async update(id: string, updateCapacityDto: UpdateCapacityDto) {
    const exists = await this.prisma.capacity.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Capacity  id ${id} topilmadi`);
    }

    return this.prisma.capacity.update({
      where: { id },
      data: updateCapacityDto,
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.capacity.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Capacity  id ${id} topilmadi`);
    }

    return this.prisma.capacity.delete({
      where: { id },
    });
  }
}
