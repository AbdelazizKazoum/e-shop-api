import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { File as MulterFile } from 'multer';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageFile'))
  async create(@Body('data') data: string, @UploadedFile() image?: MulterFile) {
    const createBrandDto: CreateBrandDto = JSON.parse(data);

    return this.brandsService.create(createBrandDto, image);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('filter') filter?: string,
  ) {
    return this.brandsService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      filter,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageFile'))
  async update(
    @Param('id') id: string,
    @Body('data') data: string,
    @UploadedFile() image?: MulterFile,
  ) {
    const updateBrandDto: UpdateBrandDto = JSON.parse(data);
    return this.brandsService.update(id, updateBrandDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
