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

  async myBasket(userId: string) {
    const items = await this.prisma.basketItem.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    return items;
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
