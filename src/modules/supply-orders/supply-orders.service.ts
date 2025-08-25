import { Injectable } from '@nestjs/common';
import { CreateSupplyOrderDto } from './dto/create-supply-order.dto';
import { UpdateSupplyOrderDto } from './dto/update-supply-order.dto';

@Injectable()
export class SupplyOrdersService {
  create(createSupplyOrderDto: CreateSupplyOrderDto) {
    return 'This action adds a new supplyOrder';
  }

  findAll() {
    return `This action returns all supplyOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supplyOrder`;
  }

  update(id: number, updateSupplyOrderDto: UpdateSupplyOrderDto) {
    return `This action updates a #${id} supplyOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplyOrder`;
  }
}
