import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(createContactDto: CreateContactDto) {

    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { skip, take, search, sortBy, sortOrder } = params;

    const where :any= search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { surName: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const orderBy:any = sortBy
      ? { [sortBy]: sortOrder || 'asc' }
      : { name: 'asc' };

    return this.prisma.contact.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`contact topilmadi`);
    }

    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    await this.findOne(id);

    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
