import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
export declare class SuppliersService {
    create(createSupplierDto: CreateSupplierDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSupplierDto: UpdateSupplierDto): string;
    remove(id: number): string;
}
