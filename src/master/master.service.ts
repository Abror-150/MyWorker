import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Master } from '@prisma/client';
import { CreateStarDto } from './dto/create-Star.dto copy';
import { connect } from 'http2';
import { where } from 'sequelize';

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService) {}
  async createMaster(dto: CreateMasterDto) {
    const existingMaster = await this.prisma.master.findFirst({
      where: { phone: dto.phone },
    });
    if (existingMaster) {
      throw new BadRequestException('Telefon raqam foydalanilgan');
    }

    if (dto.masterProduct?.length) {
      for (const item of dto.masterProduct) {
        const productExists = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!productExists) {
          throw new NotFoundException(`Product topilmadi: ${item.productId}`);
        }

        const levelExists = await this.prisma.level.findUnique({
          where: { id: item.levelId },
        });
        if (!levelExists) {
          throw new NotFoundException(`Level topilmadi: ${item.levelId}`);
        }
      }
    }

    const master = await this.prisma.master.create({
      data: {
        fullName: dto.fullName,
        year: dto.year,
        about: dto.about,
        isActive: dto.isActive ?? true,
        img: dto.img,
        passportImg: dto.passportImg,
        phone: dto.phone,
      },
    });

    if (dto.masterProduct?.length) {
      await this.prisma.masterProduct.createMany({
        data: dto.masterProduct.map((item) => ({
          masterId: master.id,
          productId: item.productId,
          levelId: item.levelId,
          minWorkingHours: item.minWorkingHours,
          priceHourly: item.priceHourly,
          priceDaily: item.priceDaily,
          experince: Number(item.experience),
        })),
      });
    }

    const result = await this.prisma.master.findUnique({
      where: { id: master.id },
      include: { masterProduct: true },
    });

    return { data: result };
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    fullName?: string;
    year?: number;
    isActive?: boolean;
    sort?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      limit = 10,
      fullName,
      year,
      isActive,
      sort = 'asc',
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (fullName) {
      where.fullName = {
        contains: fullName,
        mode: 'insensitive',
      };
    }

    if (typeof year === 'number') {
      where.year = year;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    return this.prisma.master.findMany({
      where,
      orderBy: {
        fullName: sort,
      },
      skip,
      take: limit,
    });
  }

  async findOne(id: string) {
    const master = await this.prisma.master.findUnique({
      where: { id },
      include: { masterProduct: true },
    });
    if (!master) {
      throw new NotFoundException(`Master topilmadi: ${id}`);
    }
    let avg = await this.prisma.star.aggregate({
      where: { masterId: id },
      _avg: { star: true },
    });
    let avgStarRaw = avg._avg.star ?? 0;
    let avgStar = parseFloat(avgStarRaw.toFixed(2));
    return { ...master, avgStar };
  }

  async update(id: string, dto: UpdateMasterDto): Promise<Master> {
    const existing = await this.prisma.master.findUnique({
      where: { id },
      include: { masterProduct: true },
    });
    if (!existing) {
      throw new NotFoundException(`Master topilmadi: ${id}`);
    }

    if (dto.phone && dto.phone !== existing.phone) {
      const conflict = await this.prisma.master.findFirst({
        where: { phone: dto.phone },
      });
      if (conflict) {
        throw new BadRequestException(
          'Telefon raqam boshqa masterda foydalanilgan',
        );
      }
    }

    await this.prisma.master.update({
      where: { id },
      data: {
        fullName: dto.fullName ?? existing.fullName,
        phone: dto.phone ?? existing.phone,
        year: dto.year ?? existing.year,
        about: dto.about ?? existing.about,
        isActive: dto.isActive ?? existing.isActive,
        img: dto.img ?? existing.img,
        passportImg: dto.passportImg ?? existing.passportImg,
      },
    });

    if (dto.masterProduct) {
      await this.prisma.masterProduct.deleteMany({
        where: { masterId: id },
      });

      if (dto.masterProduct.length) {
        for (const item of dto.masterProduct) {
          if (item.productId) {
            const productExists = await this.prisma.product.findUnique({
              where: { id: item.productId },
            });
            if (!productExists) {
              throw new NotFoundException(
                `Product topilmadi: ${item.productId}`,
              );
            }
          }

          if (item.levelId) {
            const levelExists = await this.prisma.level.findUnique({
              where: { id: item.levelId },
            });
            if (!levelExists) {
              throw new NotFoundException(`Level topilmadi: ${item.levelId}`);
            }
          }
        }

        await this.prisma.masterProduct.createMany({
          data: dto.masterProduct.map((item) => ({
            masterId: id,
            productId:
              item.productId ??
              existing.masterProduct.find((mp) => mp.productId)?.productId,
            levelId:
              item.levelId ??
              existing.masterProduct.find((mp) => mp.levelId)?.levelId,
            minWorkingHours: item.minWorkingHours,
            priceHourly: item.priceHourly,
            priceDaily: item.priceDaily,
            experince: item.experience,
          })),
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const master = await this.prisma.master.findUnique({
      where: { id },
    });
    if (!master) {
      throw new NotFoundException(`Master topilmadi: ${id}`);
    }
    await this.prisma.master.delete({ where: { id } });
    return { message: 'Master muvaffaqiyatli o‘chirildi' };
  }

  async createStar(data: CreateStarDto, userId: string) {
    let existingStar = await this.prisma.star.findFirst({
      where: { userId, id: data.masterId },
    });
    if (existingStar) {
      throw new BadRequestException(
        'Siz allaqachon ushbu masterga star qo‘ygansiz ',
      );
    }
    return await this.prisma.star.create({
      data: {
        user: { connect: { id: userId } },
        Master: { connect: { id: data.masterId } },
        star: data.star,
      },
    });
  }
}
