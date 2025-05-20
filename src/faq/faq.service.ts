import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { resourceUsage } from 'process';
import { resolveObjectURL } from 'buffer';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateFaqDto) {
    let created = await this.prisma.faq.create({ data });
    return created;
  }

  async findAll() {
    let data = await this.prisma.faq.findMany();
    return data;
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
