import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BasketItemService } from './basket-item.service';
import { CreateBasketItemDto } from './dto/create-basket-item.dto';
import { UpdateBasketItemDto } from './dto/update-basket-item.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('basket-item')
export class BasketItemController {
  constructor(private readonly basketItemService: BasketItemService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createBasketItemDto: CreateBasketItemDto,
    @Req() req: Request,
  ) {
    const userId = req['user-id'];
    return this.basketItemService.create(userId, createBasketItemDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all basket items with filters, sorting, and pagination',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by productId',
  })
  @ApiQuery({
    name: 'levelId',
    required: false,
    description: 'Filter by levelId',
  })
  @ApiQuery({
    name: 'toolId',
    required: false,
    description: 'Filter by toolId',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by userId',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Sort order: asc | desc (default: desc)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10)',
  })
  findAll(@Query() query: any) {
    return this.basketItemService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basketItemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBasketItemDto: UpdateBasketItemDto,
  ) {
    return this.basketItemService.update(id, updateBasketItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basketItemService.remove(id);
  }
}
