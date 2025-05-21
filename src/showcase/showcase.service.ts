import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllShowcaseDto } from './dto/filter-showcase.dto copy';

@Injectable()
export class ShowcaseService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateShowcaseDto) {
    let creadet = await this.prisma.showcase.create({ data });
    return creadet;
  }

  async findAll(query: FindAllShowcaseDto) {
    const {
      search,
      sortBy = 'createdAt', // fallback field
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = search
      ? {
          OR: [
            { name_uz: { contains: search, mode: 'insensitive' } },
            { name_ru: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.showcase.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: Number(limit),
      }),
      this.prisma.showcase.count({ where }),
    ]);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    };
  }

  async findOne(id: string) {
    let one = await this.prisma.showcase.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('showcase topilmadi');
    }
    return one;
  }

  async update(id: string, data: UpdateShowcaseDto) {
    let one = await this.prisma.showcase.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('showcase topilmadi');
    }
    let updated = await this.prisma.showcase.update({ where: { id }, data });
    return updated;
  }

  async remove(id: string) {
    let one = await this.prisma.showcase.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('showcase topilmadi');
    }
    let deleted = await this.prisma.showcase.delete({ where: { id } });
    return deleted;
  }
}
