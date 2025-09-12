import { CreateSupplyOrderDto } from './dto/create-supply-order.dto';
import { UpdateSupplyOrderDto } from './dto/update-supply-order.dto';
export declare class SupplyOrdersService {
    create(createSupplyOrderDto: CreateSupplyOrderDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSupplyOrderDto: UpdateSupplyOrderDto): string;
    remove(id: number): string;
}
