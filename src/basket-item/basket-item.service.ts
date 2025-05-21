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
    const productLevel = await this.prisma.productLevel.findFirst({
      where: {
        productId: dto.productId,
        levelId: dto.levelId,
      },
    });

    if (!productLevel) {
      throw new NotFoundException(
        'Bunday mahsulot yoki level kombinatsiyasi topilmadi',
      );
    }
    let tol = await this.prisma.tool.findFirst({ where: { id: dto.toolId } });
    if (!tol) {
      throw new BadRequestException('tool topilmadi');
    }
    const total = dto.count * productLevel.minWorkingHours;
    return this.prisma.basketItem.create({
      data: {
        userId: userId,
        productId: dto.productId,
        levelId: dto.levelId,
        workingTime: dto.workingTime,
        count: dto.count,
        toolId: dto.toolId,
        totalPrice: Number(total),
      },
      include: {
        product: true,
        level: true,
      },
    });
  }

  async findAll() {
    let data = await this.prisma.basketItem.findMany();
    return data;
  }

  async findOne(id: string) {
    let data = await this.prisma.basketItem.findFirst({ where: { id }});
    if (!data) {
      throw new NotFoundException('backet topilmadi ');
    }
    return data;
  }

  async update(id: string, data: UpdateBasketItemDto) {
    let one = await this.prisma.basketItem.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('backet topilmadi ');
    }
    let updated = await this.prisma.basketItem.update({ where: { id }, data });
    return updated;
  }

  async remove(id: string) {
    let one = await this.prisma.basketItem.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('backet topilmadi ');
    }
    let deleted = await this.prisma.basketItem.delete({ where: { id } });
    return deleted;
  }
}
