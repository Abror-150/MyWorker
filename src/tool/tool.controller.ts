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
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { userRole } from '@prisma/client';
import { AuthGuard } from 'src/guard/auth.guard';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { Roles } from 'src/user/decorators/rbuc.decorator';
import { ApiQuery } from '@nestjs/swagger';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}
  @Roles(userRole.ADMIN, userRole.VIEWER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name (uz/ru/en)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: [
      'id',
      'name_uz',
      'name_ru',
      'name_en',
      'price',
      'quantity',
      'creadetAt',
    ],
    description: 'Field to sort by',
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
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price filter',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price filter',
  })
  @ApiQuery({
    name: 'minQuantity',
    required: false,
    type: Number,
    description: 'Minimum quantity filter',
  })
  @ApiQuery({
    name: 'maxQuantity',
    required: false,
    type: Number,
    description: 'Maximum quantity filter',
  })
  async findAll(
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minQuantity') minQuantity?: string,
    @Query('maxQuantity') maxQuantity?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const minPriceNumber = minPrice ? parseInt(minPrice, 10) : undefined;
    const maxPriceNumber = maxPrice ? parseInt(maxPrice, 10) : undefined;
    const minQuantityNumber = minQuantity
      ? parseInt(minQuantity, 10)
      : undefined;
    const maxQuantityNumber = maxQuantity
      ? parseInt(maxQuantity, 10)
      : undefined;

    return this.toolService.findAll({
      search,
      sortBy,
      sortOrder,
      page: pageNumber,
      limit: limitNumber,
      minPrice: minPriceNumber,
      maxPrice: maxPriceNumber,
      minQuantity: minQuantityNumber,
      maxQuantity: maxQuantityNumber,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolService.findOne(id);
  }
  @Roles(userRole.ADMIN, userRole.VIEWER_ADMIN, userRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(id, updateToolDto);
  }
  @Roles(userRole.ADMIN, userRole.VIEWER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolService.remove(id);
  }
}
