import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { ApiQuery } from '@nestjs/swagger';
import { userRole } from '@prisma/client';
import { Roles } from 'src/user/decorators/rbuc.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RbucGuard } from 'src/guard/rbuc.guard';

@Controller('capacity')
export class CapacityController {
  constructor(private readonly capacityService: CapacityService) {}
  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCapacityDto: CreateCapacityDto) {
    return this.capacityService.create(createCapacityDto);
  }

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['id', 'name_uz', 'name_ru', 'name_en', 'createtAt'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.capacityService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.capacityService.findOne(id);
  }
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCapacityDto: UpdateCapacityDto,
  ) {
    return this.capacityService.update(id, updateCapacityDto);
  }
  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.capacityService.remove(id);
  }
}
