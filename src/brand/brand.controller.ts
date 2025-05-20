import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Roles } from 'src/user/decorators/rbuc.decorator';
import { userRole } from '@prisma/client';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name fields',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['id', 'name_uz', 'name_ru', 'name_en', 'createtAt'],
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    return this.brandService.findAll({
      search,
      sortBy,
      sortOrder,
      page: pageNumber,
      limit: limitNumber,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }
  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
