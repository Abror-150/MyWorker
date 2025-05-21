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
} from '@nestjs/common';
import { BasketItemService } from './basket-item.service';
import { CreateBasketItemDto } from './dto/create-basket-item.dto';
import { UpdateBasketItemDto } from './dto/update-basket-item.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';

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
  findAll() {
    return this.basketItemService.findAll();
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
