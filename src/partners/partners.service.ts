import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPartnerDto: CreatePartnerDto) {
    return this.prisma.partners.create({
      data: createPartnerDto,
    });
  }

  async findAll(query: any) {
    const {
      page = 1,
      limit = 10,
      search = '',
      lang = 'uz',
      sortBy = '',
      sortOrder = 'asc',
    } = query;

    const skip = (page - 1) * limit;
    const take = Number(limit);

    const nameField = `name_${lang}`;
    const validSortFields = ['id', 'name_uz', 'name_ru', 'name_en', 'image'];

    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : nameField;

    const whereClause = search
      ? {
          [nameField]: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.partners.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: {
          [safeSortBy]: sortOrder,
        },
      }),
      this.prisma.partners.count({
        where: whereClause,
      }),
    ]);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    };
  }

  async findOne(id: string) {
    const partner = await this.prisma.partners.findUnique({
      where: { id },
    });

    if (!partner) throw new NotFoundException('Partner topilmadi');

    return partner;
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    const partner = await this.prisma.partners.findUnique({
      where: { id },
    });

    if (!partner) throw new NotFoundException('Partner topilmadi');

    return this.prisma.partners.update({
      where: { id },
      data: updatePartnerDto,
    });
  }

  async remove(id: string) {
    const partner = await this.prisma.partners.findUnique({
      where: { id },
    });

    if (!partner) throw new NotFoundException('Partner topilmadi');

    return this.prisma.partners.delete({
      where: { id },
    });
  }
}
