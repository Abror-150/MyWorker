import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MasterService } from './master.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { userRole } from '@prisma/client';
import { RbucGuard } from 'src/guard/rbuc.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/user/decorators/rbuc.decorator';

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
  findAll() {
    return this.masterService.findAll();
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
}
