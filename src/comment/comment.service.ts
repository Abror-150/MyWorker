import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    return this.prisma.comment.create({
      data: {
        message: createCommentDto.message,
        orderId: createCommentDto.orderId,
        userId: userId,
      },
    });
  }

  async findAll(query: {
    message?: string;
    sortBy?: 'id' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      message,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where: {
          ...(message && {
            message: {
              contains: message,
              mode: 'insensitive',
            },
          }),
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: Number(limit),
      }),

      this.prisma.comment.count({
        where: {
          ...(message && {
            message: {
              contains: message,
              mode: 'insensitive',
            },
          }),
        },
      }),
    ]);

    return {
      data,
      total,
      page: Number(page),
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException('Comment topilmadi');
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException('Comment topilmadi');
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException('Comment topilmadi');
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
