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
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { Roles, ROLES_KEY } from 'src/user/decorators/rbuc.decorator';
import { userRole } from '@prisma/client';
import { ApiQuery } from '@nestjs/swagger';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by any name field',
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
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  async findAll(
    @Query('search') search?: string,
    @Query('sortBy')
    sortBy?: 'id' | 'name_uz' | 'name_ru' | 'name_en' | 'createdAt',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    return this.regionService.findAll({
      search,
      sortBy,
      sortOrder,
      page: pageNumber,
      limit: limitNumber,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }
  @Roles(userRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}
