import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandRepository } from './repositories/brand.repository';
import { Brand } from './entities/brand.entity';
import { R2Service } from '../storage/r2.service';
import { v4 as uuidv4 } from 'uuid';
import { File as MulterFile } from 'multer';
import { Like } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly r2Service: R2Service,
  ) {}

  async create(
    createBrandDto: CreateBrandDto,
    image?: MulterFile,
  ): Promise<Brand> {
    let imageUrl: string | undefined;
    let key: string | undefined;
    try {
      if (image) {
        key = `brands/${createBrandDto.name}-${uuidv4()}.${
          image.mimetype.split('/')[1]
        }`;
        imageUrl = await this.r2Service.uploadFile(image, key);
      }
      const brand = await this.brandRepository.create({
        ...createBrandDto,
        imageUrl: imageUrl,
      });
      return brand;
    } catch (error) {
      // Delete uploaded file if error occurs
      if (imageUrl && key) {
        await this.r2Service.deleteFile(imageUrl);
      }
      throw new InternalServerErrorException('Failed to create brand');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filter?: string,
  ): Promise<{ data: Brand[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const where = filter
      ? [{ name: Like(`%${filter}%`) }, { description: Like(`%${filter}%`) }]
      : undefined;

    const [data, total] = await this.brandRepository.findAndCountWithPagination(
      {
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      },
    );

    return { data, total, page, limit };
  }

  /**
   * Get all brands without pagination or filter
   */
  async getAllBrands(): Promise<Brand[]> {
    return await this.brandRepository.findAll({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ id });
    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    return brand;
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
    image?: MulterFile,
  ): Promise<Brand> {
    let imageUrl: string | undefined;
    try {
      const brand = await this.brandRepository.findOne({ id });
      if (!brand) {
        throw new NotFoundException(`Brand with id ${id} not found`);
      }

      // Handle new image upload
      if (image) {
        // If an old image exists, delete it from R2 storage
        if (brand.imageUrl) {
          await this.r2Service.deleteFile(brand.imageUrl);
        }
        // Upload the new image and get its path/key
        const key = `brands/main/${Date.now()}-${image.originalname}`;
        imageUrl = await this.r2Service.uploadFile(image, key);
      }

      return this.brandRepository.findOneAndUpdate(
        { id },
        { ...updateBrandDto, imageUrl: imageUrl ?? brand.imageUrl },
      );
    } catch (error) {
      // If upload succeeded but update failed, delete the new image
      if (imageUrl) {
        await this.r2Service.deleteFile(imageUrl);
      }
      throw new InternalServerErrorException('Failed to update brand');
    }
  }

  async remove(id: string): Promise<void> {
    const brand = await this.brandRepository.findOne({ id });
    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    // Delete image from storage if exists
    if (brand.imageUrl) {
      await this.r2Service.deleteFile(brand.imageUrl);
    }
    await this.brandRepository.findOneAndDelete({ id });
  }
}
