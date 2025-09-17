import { BrandsService } from './brands.service';
import { File as MulterFile } from 'multer';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(data: string, image?: MulterFile): Promise<import("./entities/brand.entity").Brand>;
    findAll(page?: number, limit?: number, filter?: string): Promise<{
        data: import("./entities/brand.entity").Brand[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./entities/brand.entity").Brand>;
    update(id: string, data: string, image?: MulterFile): Promise<import("./entities/brand.entity").Brand>;
    remove(id: string): Promise<void>;
}
