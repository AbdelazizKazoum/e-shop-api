import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandRepository } from './repositories/brand.repository';
import { Brand } from './entities/brand.entity';
import { R2Service } from '../storage/r2.service';
import { File as MulterFile } from 'multer';
export declare class BrandsService {
    private readonly brandRepository;
    private readonly r2Service;
    constructor(brandRepository: BrandRepository, r2Service: R2Service);
    create(createBrandDto: CreateBrandDto, image?: MulterFile): Promise<Brand>;
    findAll(page?: number, limit?: number, filter?: string): Promise<{
        data: Brand[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAllBrands(): Promise<Brand[]>;
    findOne(id: string): Promise<Brand>;
    update(id: string, updateBrandDto: UpdateBrandDto, image?: MulterFile): Promise<Brand>;
    remove(id: string): Promise<void>;
}
