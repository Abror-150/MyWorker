import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface FindAllProductParams {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name_uz: data.name_uz,
          name_ru: data.name_ru,
          name_en: data.name_en,
          img: data.img,
          isActive: data.isActive ?? true,
          minWorkingHours: data.minWorkingHours,
        },
      });

      if (data.productLevel && data.productLevel.length > 0) {
        for (const item of data.productLevel) {
          const levelExists = await this.prisma.level.findUnique({
            where: { id: item.levelId },
          });
          if (!levelExists) {
            throw new NotFoundException(`Level topilmadi: ${item.levelId}`);
          }
        }

        await this.prisma.productLevel.createMany({
          data: data.productLevel.map((item) => ({
            productId: product.id,
            levelId: item.levelId,
            minWorkingHours: item.minWorkingHours,
            priceHourly: item.priceHourly,

            priceDaily: item.priceDaily,
          })),
        });
      }

      if (data.productTool && data.productTool.length > 0) {
        for (const toolId of data.productTool) {
          const toolExists = await this.prisma.tool.findUnique({
            where: { id: toolId },
          });
          if (!toolExists) {
            throw new NotFoundException(`Tool topilmadi: ${toolId}`);
          }
        }

        await this.prisma.productTool.createMany({
          data: data.productTool.map((toolId) => ({
            productId: product.id,
            toolId: toolId,
          })),
        });
      }

      const result = await this.prisma.product.findUnique({
        where: { id: product.id },
        include: {
          productLevel: true,
          productTool: true,
        },
      });

      return { data: result };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findAll(params: FindAllProductParams = {}) {
    const {
      search,
      isActive,
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
      'isActive',
    ];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    const where: any = {};

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name_uz: { contains: search, mode: 'insensitive' } },
        { name_ru: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
      ];
    }

    const data = await this.prisma.product.findMany({
      where,

      orderBy: { [validSortBy]: validSortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.product.count({ where });

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
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        productTool: true,
        productLevel: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product topilmadi');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product topilmadi');
    }

    await this.prisma.product.update({
      where: { id },
      data: {
        name_uz: dto.name_uz ?? product.name_uz,
        name_ru: dto.name_ru ?? product.name_ru,
        name_en: dto.name_en ?? product.name_en,
        img: dto.img ?? product.img,
        isActive: dto.isActive ?? product.isActive,
      },
    });

    if (dto.productLevel?.length) {
      await this.prisma.productLevel.deleteMany({
        where: { productId: id },
      });

      for (const item of dto.productLevel) {
        const levelExists = await this.prisma.level.findUnique({
          where: { id: item.levelId },
        });
        if (!levelExists) {
          throw new NotFoundException(`Level topilmadi: ${item.levelId}`);
        }
      }

      await this.prisma.productLevel.createMany({
        data: dto.productLevel.map((item) => ({
          productId: id,
          levelId: item.levelId,
          minWorkingHours: item.minWorkingHours,
          priceHourly: item.priceHourly,
          priceDaily: item.priceDaily,
        })),
      });
    }

    if (dto.productTool?.length) {
      await this.prisma.productTool.deleteMany({
        where: { productId: id },
      });

      for (const toolId of dto.productTool) {
        const toolExists = await this.prisma.tool.findUnique({
          where: { id: toolId },
        });
        if (!toolExists) {
          throw new NotFoundException(`Tool topilmadi: ${toolId}`);
        }
      }

      await this.prisma.productTool.createMany({
        data: dto.productTool.map((toolId) => ({
          productId: id,
          toolId: toolId,
        })),
      });
    }

    const updated = await this.prisma.product.findUnique({
      where: { id },
      include: {
        productLevel: true,
        productTool: true,
      },
    });

    return { data: updated };
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
