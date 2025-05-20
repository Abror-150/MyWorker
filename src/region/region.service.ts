import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';


interface FindAllRegionParams {
  search?: string;
  sortBy?: 'id' | 'name_uz' | 'name_ru' | 'name_en' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    const { name_uz, name_ru, name_en } = createRegionDto;

    const existingRegion = await this.prisma.region.findFirst({
      where: {
        OR: [{ name_uz }, { name_ru }, { name_en }],
      },
    });

    if (existingRegion) {
      throw new BadRequestException('Bu nomdagi region allaqachon mavjud');
    }

    return this.prisma.region.create({
      data: createRegionDto,
    });
  }

  
  
  async findAll(params: FindAllRegionParams) {
    const {
      search,
      sortBy = 'id',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = params;
  
    const allowedSortFields = ['id', 'name_uz', 'name_ru', 'name_en', 'createtAt'];
  
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';
  
    const where: any = search
      ? {
          OR: [
            { name_uz: { contains: search, mode: 'insensitive' } },
            { name_ru: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};
  
    const regions = await this.prisma.region.findMany({
      where,
      orderBy: { [validSortBy]: validSortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const total = await this.prisma.region.count({ where });
  
    return {
      data: regions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  

  async findOne(id: string) {
    const region = await this.prisma.region.findUnique({ where: { id } });

    if (!region) {
      throw new NotFoundException(`Region topilmadi (id=${id})`);
    }

    return region;
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    const region = await this.prisma.region.findUnique({ where: { id } });

    if (!region) {
      throw new NotFoundException(
        `Yangilanish uchun region topilmadi (id=${id})`,
      );
    }

    return this.prisma.region.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: string) {
    const region = await this.prisma.region.findUnique({ where: { id } });

    if (!region) {
      throw new NotFoundException(
        `O‘chirish uchun region topilmadi (id=${id})`,
      );
    }

    return this.prisma.region.delete({
      where: { id },
    });
  }
}
