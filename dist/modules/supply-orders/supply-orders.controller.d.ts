import { SupplyOrdersService } from './supply-orders.service';
import { CreateSupplyOrderDto } from './dto/create-supply-order.dto';
import { UpdateSupplyOrderDto } from './dto/update-supply-order.dto';
export declare class SupplyOrdersController {
    private readonly supplyOrdersService;
    constructor(supplyOrdersService: SupplyOrdersService);
    create(createSupplyOrderDto: CreateSupplyOrderDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSupplyOrderDto: UpdateSupplyOrderDto): string;
    remove(id: string): string;
}
