import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MasterService } from './master.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { userRole } from '@prisma/client';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/user/decorators/rbuc.decorator';
import { CreateStarDto } from './dto/create-Star.dto copy';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}
  @Roles(userRole.ADMIN, userRole.VIEWER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMasterDto: CreateMasterDto) {
    return this.masterService.createMaster(createMasterDto);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Sahifa raqami (pagination)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Sahifada nechta yozuv (pagination)',
  })
  @ApiQuery({
    name: 'fullName',
    required: false,
    type: String,
    description: 'FullName bo‘yicha filter (qidiruv)',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Year bo‘yicha filter',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Faol yoki faol emas bo‘yicha filter',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
    description: 'FullName bo‘yicha tartiblash (asc yoki desc)',
  })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('fullName') fullName?: string,
    @Query('year') year?: string,
    @Query('isActive') isActive?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    const pageNumber = page ? +page : 1;
    const limitNumber = limit ? +limit : 10;
    const yearNumber = year ? +year : undefined;

    let isActiveBool: boolean | undefined = undefined;
    if (isActive === 'true') {
      isActiveBool = true;
    } else if (isActive === 'false') {
      isActiveBool = false;
    }

    return this.masterService.findAll({
      page: pageNumber,
      limit: limitNumber,
      fullName,
      year: yearNumber,
      isActive: isActiveBool,
      sort: sort || 'asc',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterService.findOne(id);
  }
  @Roles(userRole.ADMIN, userRole.VIEWER_ADMIN, userRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMasterDto: UpdateMasterDto) {
    return this.masterService.update(id, updateMasterDto);
  }
  @Roles(userRole.ADMIN, userRole.VIEWER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('star')
  createStar(@Body() data: CreateStarDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.masterService.createStar(data, userId);
  }
}
