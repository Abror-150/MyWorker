import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ShowcaseService } from './showcase.service';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { ApiQuery } from '@nestjs/swagger';
import { FindAllShowcaseDto, SortOrder } from './dto/filter-showcase.dto copy';

@Controller('showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  @Post()
  create(@Body() createShowcaseDto: CreateShowcaseDto) {
    return this.showcaseService.create(createShowcaseDto);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Nomi bo‘yicha qidirish',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: SortOrder,
    example: 'asc',
    description: 'Saralash tartibi',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Sahifa raqami',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Har sahifadagi elementlar soni',
  })
  findAll(@Query() query: FindAllShowcaseDto) {
    return this.showcaseService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showcaseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowcaseDto: UpdateShowcaseDto,
  ) {
    return this.showcaseService.update(id, updateShowcaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showcaseService.remove(id);
  }
}
