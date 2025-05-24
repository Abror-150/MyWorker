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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Nechta yozuvni otkazib yuborish (pagination offset)',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Nechta yozuv olish (pagination limit)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: "Qidiruv kalit so'zlari (name, surName)",
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: "Qaysi ustun bo'yicha tartiblash (default: name)",
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: "Tartib yo'nalishi (asc yoki desc, default: asc)",
  })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.contactService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      search,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
