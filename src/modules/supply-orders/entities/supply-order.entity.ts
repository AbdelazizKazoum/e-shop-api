/* eslint-disable prettier/prettier */
// supplier-order.entity.ts
import { Supplier } from 'src/modules/suppliers/entities/supplier.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { SupplyOrderItem } from './supplyOrderItem.entity';

@Entity()
export class SupplyOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.orders)
  @JoinColumn()
  supplier: Supplier;

  @OneToMany(() => SupplyOrderItem, (item) => item.order, { cascade: true })
  items: SupplyOrderItem[];

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'received', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'received' | 'cancelled';

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
