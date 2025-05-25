import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, OrderProductDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { where } from 'sequelize';
import { AssignMastersDto } from './dto/assig-masterdto';
import { orderStatus, Prisma, PrismaClient } from '@prisma/client';
import { contains } from 'class-validator';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tgService: TgBotService,
  ) {}
  async create(data: CreateOrderDto, userId: string) {
    const basketItems = await this.prisma.basketItem.findMany({
      where: { userId },
      include: { product: true, level: true, tool: true },
    });

    if (basketItems.length === 0) {
      throw new BadRequestException(
        'Savatcha bo‘sh, buyurtma yaratib bo‘lmaydi',
      );
    }

    const toolIds = basketItems
      .filter((b) => b.toolId != null)
      .map((b) => b.toolId!);
    const toolsData = toolIds.length
      ? await this.prisma.tool.findMany({ where: { id: { in: toolIds } } })
      : [];

    for (const item of basketItems) {
      if (item.toolId) {
        const toolData = toolsData.find((t) => t.id === item.toolId);
        if (!toolData || toolData.quantity < item.count) {
          throw new BadRequestException(
            `Tool ${item.toolId} ning ombordagi miqdori yetarli emas`,
          );
        }
      }
    }

    let productTotal = 0;
    for (const item of data.orderProducts) {
      const productSum = item.count * item.price;
      productTotal += productSum;

      if (item.tools && item.tools.length > 0) {
        for (const tool of item.tools) {
          const foundTool = await this.prisma.tool.findUnique({
            where: { id: tool.toolId },
            select: { price: true },
          });

          const toolPrice = foundTool?.price || 0;
          const toolSum = tool.count * toolPrice;
          productTotal += toolSum;
        }
      }
    }

    const newOrder = await this.prisma.order.create({
      data: {
        userId,
        total: productTotal,
        lattitude: data.location?.lat ?? '',
        longitude: data.location?.long ?? '',
        address: data.address ?? '',
        date: data.date ?? new Date(),
        paymentType: data.paymentType ?? 'CASH',
        withDelivery: data.withDelivery ?? false,
        deliveryComment: data.commentToDelivery ?? '',
        status: 'IN_PROGRESS',
        orderProduct: {
          create: basketItems.map((item) => {
            const base: any = {
              product: { connect: { id: item.productId! } },
              count: item.count,
              price: item.totalPrice,
            };
            if (item.levelId) {
              base.level = { connect: { id: item.levelId } };
            }
            if (item.workingTime != null) {
              base.workingTime = item.workingTime;
            }
            if (item.timeUnit) {
              base.timeUnit = item.timeUnit;
            }
            if (item.toolId) {
              base.orderProductTool = {
                create: [
                  {
                    tool: { connect: { id: item.toolId } },
                    count: item.count,
                  },
                ],
              };
            }
            return base as Prisma.orderProductCreateWithoutOrderInput;
          }),
        },
      },
    });

    for (const item of basketItems) {
      if (item.toolId) {
        await this.prisma.tool.update({
          where: { id: item.toolId },
          data: { quantity: { decrement: item.count } },
        });
      }
    }

    await this.prisma.basketItem.deleteMany({ where: { userId } });

    const fullOrder = await this.prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        user: { select: { fullName: true } },
        orderProduct: { include: { product: { select: { name_uz: true } } } },
        orderMaster: { include: { Master: true } },
      },
    });
    if (!fullOrder) {
      throw new NotFoundException('Buyurtma topilmadi');
    }
    await this.tgService.sendOrderNotification(fullOrder);

    return newOrder;
  }

  async assignMastersToOrder(orderId: string, data: AssignMastersDto) {
    return this.prisma.$transaction(async (tx) => {
      await tx.orderMaster.deleteMany({ where: { orderId } });

      for (const masterId of data.masterIds) {
        await tx.orderMaster.create({
          data: {
            orderId,
            masterId,
          },
        });
      }
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'COMPLETED',
        },
      });

      return tx.order.findUnique({
        where: { id: orderId },
        include: { orderMaster: { include: { Master: true } } },
      });
    });
  }
  async myOrder(userId: string) {
    let data = await this.prisma.order.findMany({
      where: { userId: userId },
      select: {
        id: true,
        total: true,
        date: true,
        address: true,

        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });

    return data;
  }
  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    userId?: string;
    address?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'creadetAt',
      sortOrder = 'desc',
      status,
      userId,
      address,
    } = query;

    const skip = Number(page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (address) {
      where.address = { contains: address, mode: 'insensitive' };
    }

    if (userId) {
      where.userId = userId;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: Number(limit),
        include: {
          user: {
            select: { fullName: true },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      total,
      page: Number(page),
      lastPage: Math.ceil(total / limit),
      data,
    };
  }

  async findOne(id: string) {
    const one = await this.prisma.order.findFirst({
      where: { id },
      include: {
        orderMaster: {
          include: {
            Master: true,
          },
        },
      },
    });

    if (!one) {
      throw new NotFoundException('Order topilmadi');
    }

    return one;
  }

  async update(orderId: string, data: UpdateOrderDto, userId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const oldOrder = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          orderProduct: {
            include: {
              orderProductTool: true,
            },
          },
        },
      });

      if (!oldOrder) throw new Error('Buyurtma topilmadi');

      if (oldOrder.userId !== userId)
        throw new BadRequestException(
          'Sizda bu buyurtmani yangilash huquqi yo‘q',
        );

      if (data.orderProducts) {
        if (data.orderProducts.length === 0) {
          throw new BadRequestException(
            "orderProducts bo'sh bo'lishi mumkin emas",
          );
        }

        for (const oldProduct of oldOrder.orderProduct) {
          for (const oldTool of oldProduct.orderProductTool) {
            await tx.tool.update({
              where: { id: oldTool.toolId },
              data: { quantity: { increment: oldTool.count } },
            });
          }
        }

        for (const oldProduct of oldOrder.orderProduct) {
          await tx.orderProductTool.deleteMany({
            where: { orderProductId: oldProduct.id },
          });
        }

        await tx.orderProduct.deleteMany({ where: { orderId } });
        await tx.orderMaster.deleteMany({ where: { orderId } });

        const total = data.orderProducts.reduce(
          (sum, p) => sum + p.count * p.price,
          0,
        );

        const toolUsageMap = new Map<string, number>();
        for (const p of data.orderProducts) {
          for (const t of p.tools) {
            const current = toolUsageMap.get(t.toolId) || 0;
            toolUsageMap.set(t.toolId, current + t.count);
          }
        }

        for (const [toolId, totalCount] of toolUsageMap.entries()) {
          const tool = await tx.tool.findUnique({ where: { id: toolId } });
          if (!tool || tool.quantity < totalCount) {
            throw new Error(`Tool ${toolId} omborda yetarli emas`);
          }
        }

        await tx.order.update({
          where: { id: orderId },
          data: {
            total: total,
            lattitude: data.location?.lat,
            longitude: data.location?.long,
            address: data.address,
            date: data.date,
            paymentType: data.paymentType,
            withDelivery: data.withDelivery,
            deliveryComment: data.commentToDelivery,
            status: data.status
              ? { set: data.status as orderStatus }
              : undefined,
            orderProduct: {
              create: data.orderProducts.map((item) => ({
                product: { connect: { id: item.productId } },
                level: { connect: { id: item.levelId } },
                count: item.count,
                price: item.price,
                workingTime: item.workingTime,
                timeUnit: item.timeUnit,
                orderProductTool: {
                  create: item.tools.map((tool) => ({
                    tool: { connect: { id: tool.toolId } },
                    count: tool.count,
                  })),
                },
              })),
            },
          },
        });

        for (const [toolId, totalCount] of toolUsageMap.entries()) {
          await tx.tool.update({
            where: { id: toolId },
            data: { quantity: { decrement: totalCount } },
          });
        }

        if (data.masters && data.masters.length > 0) {
          for (const masterId of data.masters) {
            await tx.orderMaster.create({
              data: {
                orderId,
                masterId,
              },
            });
          }
        }

        const updatedOrder = await tx.order.findUnique({
          where: { id: orderId },
        });

        return updatedOrder;
      } else {
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            lattitude: data.location?.lat ?? oldOrder.lattitude,
            longitude: data.location?.long ?? oldOrder.longitude,
            address: data.address ?? oldOrder.address,
            date: data.date ?? oldOrder.date,
            paymentType: data.paymentType ?? oldOrder.paymentType,
            withDelivery: data.withDelivery ?? oldOrder.withDelivery,
            deliveryComment: data.commentToDelivery ?? oldOrder.deliveryComment,
            status: data.status
              ? { set: data.status as orderStatus }
              : oldOrder.status,
          },
        });

        return updatedOrder;
      }
    });
  }

  async remove(id: string) {
    const one = await this.prisma.order.findFirst({ where: { id } });
    if (!one) {
      throw new NotFoundException('Order topilmadi');
    }

    const orderProducts = await this.prisma.orderProduct.findMany({
      where: { orderId: id },
      select: { id: true },
    });

    const orderProductIds = orderProducts.map((op) => op.id);

    await this.prisma.orderProductTool.deleteMany({
      where: {
        orderProductId: { in: orderProductIds },
      },
    });

    await this.prisma.orderProduct.deleteMany({ where: { orderId: id } });

    await this.prisma.orderMaster.deleteMany({ where: { orderId: id } });

    await this.prisma.comment.deleteMany({ where: { orderId: id } });

    const deleted = await this.prisma.order.delete({ where: { id } });

    return deleted;
  }
}
