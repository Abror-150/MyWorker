import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBasketItemDto } from './dto/create-basket-item.dto';
import { UpdateBasketItemDto } from './dto/update-basket-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BasketItemService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, dto: CreateBasketItemDto) {
    const productLevell = await this.prisma.productLevel.findFirst({
      where: {
        productId: dto.productId,
      },
    });

    if (!productLevell) {
      console.log(productLevell, 'sasg');

      throw new NotFoundException('Bunday mahsulot topilmadi');
    }
    const productLevel2 = await this.prisma.productLevel.findFirst({
      where: {
        levelId: dto.levelId,
      },
    });

    if (!productLevel2) {
      throw new NotFoundException('Bunday level topilmadi');
    }
    let tol = await this.prisma.tool.findFirst({ where: { id: dto.toolId } });
    if (!tol) {
      throw new BadRequestException('tool topilmadi');
    }
    const total = dto.count * productLevell.minWorkingHours;
    return this.prisma.basketItem.create({
      data: {
        userId: userId,
        productId: dto.productId,
        levelId: dto.levelId,
        workingTime: dto.workingTime,
        count: dto.count,
        toolId: dto.toolId,
        timeUnit: dto.timeUnit,
        totalPrice: Number(total),
      },
    });
  }

  async findAll(query: any) {
    const {
      productId,
      levelId,
      toolId,
      userId,
      sortBy = 'id',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const filterConditions: any = {};

    if (productId) filterConditions.productId = productId;
    if (levelId) filterConditions.levelId = levelId;
    if (toolId) filterConditions.toolId = toolId;
    if (userId) filterConditions.userId = userId;

    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.basketItem.findMany({
        where: filterConditions,
        orderBy: {
          [sortBy]: order,
        },
        skip: +skip,
        take: +limit,
        include: {
          product: { select: { name_uz: true } },
          tool: { select: { name_uz: true } },
        },
      }),
      this.prisma.basketItem.count({
        where: filterConditions,
      }),
    ]);

    return {
      data,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    let data = await this.prisma.basketItem.findFirst({ where: { id } });
    if (!data) {
      throw new NotFoundException('basket topilmadi ');
    }
    return data;
  }

  async update(id: string, data: UpdateBasketItemDto) {
    let one = await this.prisma.basketItem.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('basket topilmadi ');
    }
    let updated = await this.prisma.basketItem.update({ where: { id }, data });
    return updated;
  }

  async remove(id: string) {
    let one = await this.prisma.basketItem.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('basket topilmadi ');
    }
    let deleted = await this.prisma.basketItem.delete({ where: { id } });
    return deleted;
  }
}
