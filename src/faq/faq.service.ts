import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { resourceUsage } from 'process';
import { resolveObjectURL } from 'buffer';

export interface FindAllLevelParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'question' | 'answer' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateFaqDto) {
    let created = await this.prisma.faq.create({ data });
    return created;
  }

  async findAll(query: FindAllLevelParams = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.faq.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.faq.count({ where }),
    ]);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    };
  }

  async update(id: string, data: UpdateFaqDto) {
    let one = await this.prisma.faq.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('faq topilmadi');
    }
    let updated = await this.prisma.faq.update({ where: { id }, data });
    return updated;
  }

  async remove(id: string) {
    let one = await this.prisma.faq.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('faq topilmadi');
    }
    let deleted = await this.prisma.faq.delete({ where: { id } });
    return deleted;
  }
}
