import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

interface FindAllToolParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createToolDto: CreateToolDto) {
    const brand = await this.prisma.brand.findFirst({
      where: { id: createToolDto.brandId },
    });
    if (!brand) {
      throw new NotFoundException('Brand topilmadi ');
    }
    const capacity = await this.prisma.capacity.findFirst({
      where: { id: createToolDto.capacityId },
    });
    if (!capacity) {
      throw new NotFoundException('Capacity topilmadi');
    }
    const size = await this.prisma.size.findFirst({
      where: { id: createToolDto.sizeId },
    });
    if (!size) {
      throw new NotFoundException('Size topilmadi');
    }
    const randomNumber = Number(
      Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(''),
    );
    console.log(randomNumber);

    const newTool = await this.prisma.tool.create({
      data: { ...createToolDto, code: randomNumber, isActive: true },
    });
    return { data: newTool };
  }

  async findAll(params: FindAllToolParams = {}) {
    const {
      search,
      sortBy = 'id',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
    } = params;

    const allowedSortFields = [
      'id',
      'name_uz',
      'name_ru',
      'name_en',
      'price',
      'quantity',
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

    if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
      where.price = {};
      if (typeof minPrice === 'number') {
        where.price.gte = minPrice;
      }
      if (typeof maxPrice === 'number') {
        where.price.lte = maxPrice;
      }
    }

    if (typeof minQuantity === 'number' || typeof maxQuantity === 'number') {
      where.quantity = {};
      if (typeof minQuantity === 'number') {
        where.quantity.gte = minQuantity;
      }
      if (typeof maxQuantity === 'number') {
        where.quantity.lte = maxQuantity;
      }
    }

    const tools = await this.prisma.tool.findMany({
      where,
      orderBy: { [validSortBy]: validSortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.tool.count({ where });

    return {
      data: tools,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const tool = await this.prisma.tool.findUnique({
      where: { id },
      include: { brand: true, size: true, Capacity: true },
    });
    if (!tool) {
      throw new NotFoundException('Tool  topilmadi');
    }
    return tool;
  }

  async update(id: string, updateToolDto: UpdateToolDto) {
    await this.findOne(id);
    return this.prisma.tool.update({
      where: { id },
      data: updateToolDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tool.delete({ where: { id } });
  }
}
