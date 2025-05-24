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
import { GeneralInfoService } from './general-info.service';
import { CreateGeneralInfoDto } from './dto/create-general-info.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { Roles } from 'src/user/decorators/rbuc.decorator';
import { userRole } from '@prisma/client';
import { ApiQuery } from '@nestjs/swagger';

@Controller('general-info')
export class GeneralInfoController {
  constructor(private readonly generalInfoService: GeneralInfoService) {}

  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createGeneralInfoDto: CreateGeneralInfoDto) {
    return this.generalInfoService.create(createGeneralInfoDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'gmail' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('search') search?: string,
  ) {
    return this.generalInfoService.findAll({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as
        | 'id'
        | 'phone'
        | 'email'
        | 'address'
        | 'telegram'
        | 'instagram'
        | 'description'
        | 'createdAt'
        | undefined,
      sortOrder,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalInfoService.findOne(id);
  }
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGeneralInfoDto: UpdateGeneralInfoDto,
  ) {
    return this.generalInfoService.update(id, updateGeneralInfoDto);
  }
  @Roles(userRole.ADMIN)
  @UseGuards(RbucGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generalInfoService.remove(id);
  }
}
