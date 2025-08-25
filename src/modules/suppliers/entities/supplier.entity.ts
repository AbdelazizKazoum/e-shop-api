/* eslint-disable prettier/prettier */
import { StockMovement } from 'src/modules/stock-movements/entities/stock-movement.entity';
import { SupplyOrder } from 'src/modules/supply-orders/entities/supply-order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active',
  })
  status: 'active' | 'inactive' | 'blacklisted';

  @OneToMany(() => SupplyOrder, (order) => order.supplier)
  @JoinColumn()
  orders: SupplyOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockMovement, (movement) => movement.supplier, {
    nullable: true,
  })
  @JoinColumn()
  stockMovements: StockMovement[];
}
