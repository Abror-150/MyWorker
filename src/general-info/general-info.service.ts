import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGeneralInfoDto } from './dto/create-general-info.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeneralInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGeneralInfoDto: CreateGeneralInfoDto) {
    return await this.prisma.generalInfo.create({
      data: createGeneralInfoDto,
    });
  }

  async findAll() {
    return await this.prisma.generalInfo.findMany();
  }

  async findOne(id: string) {
    const generalInfo = await this.prisma.generalInfo.findUnique({
      where: { id },
    });
    if (!generalInfo) {
      throw new NotFoundException(`GeneralInfo ${id} topilmadi`);
    }
    return generalInfo;
  }

  async update(id: string, updateGeneralInfoDto: UpdateGeneralInfoDto) {
    const generalInfo = await this.prisma.generalInfo.findUnique({
      where: { id },
    });
    if (!generalInfo) {
      throw new NotFoundException(`GeneralInfo ${id} topilmadi`);
    }
    return await this.prisma.generalInfo.update({
      where: { id },
      data: updateGeneralInfoDto,
    });
  }

  async remove(id: string) {
    const generalInfo = await this.prisma.generalInfo.findUnique({
      where: { id },
    });
    if (!generalInfo) {
      throw new NotFoundException(`GeneralInfo ${id} topilmadi`);
    }
    return await this.prisma.generalInfo.delete({
      where: { id },
    });
  }
}
