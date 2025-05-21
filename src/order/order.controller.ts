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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { AssignMastersDto } from './dto/assig-masterdto';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { Roles } from 'src/user/decorators/rbuc.decorator';
import { userInfo } from 'os';
import { userRole } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.orderService.create(createOrderDto, userId);
  }
  @Get('myOrder')
  myOrder(@Req() req: Request) {
    let userId = req['user-id'];
    return this.orderService.myOrder(userId);
  }

  @Get()
  @ApiQuery({ name: 'address', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['creadetAt'] })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query() query: any) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    const userId = req['user-id'];
    return this.orderService.update(id, updateOrderDto, userId);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':orderId/assign-masters')
  async assignMasters(
    @Param('orderId') orderId: string,
    @Body() data: AssignMastersDto,
  ) {
    return this.orderService.assignMastersToOrder(orderId, data);
  }
}
