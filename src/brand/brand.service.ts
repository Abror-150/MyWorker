import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface FindAllBrandParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: createBrandDto,
    });
  }

  async findAll(params: FindAllBrandParams) {
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

    const brands = await this.prisma.brand.findMany({
      where,
      orderBy: { [validSortBy]: validSortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.brand.count({ where });

    return {
      data: brands,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!brand) {
      throw new NotFoundException(`Brand  id ${id} topilmadi`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    await this.findOne(id);
    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.brand.delete({
      where: { id },
    });
  }
}
