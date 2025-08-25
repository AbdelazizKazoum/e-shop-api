/* eslint-disable prettier/prettier */
// supplier-order-item.entity.ts
import { Variant } from 'src/modules/products/entities/variant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupplyOrder } from './supply-order.entity';

@Entity()
export class SupplyOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SupplyOrder, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: SupplyOrder;

  @ManyToOne(() => Variant, (detail) => detail.orderItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'detailProductId' }) // Ensure this matches the DB column name
  variant: Variant;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subTotal: number;
}
