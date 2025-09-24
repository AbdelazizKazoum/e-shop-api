/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Variant } from 'src/modules/products/entities/variant.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Supplier } from 'src/modules/suppliers/entities/supplier.entity';
import { SupplyOrder } from 'src/modules/supply-orders/entities/supply-order.entity';
import {
  StockMovementReason,
  StockMovementType,
} from '../types/stock-movement-type.enum';

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => Variant, (variant) => variant.movements, {
    onDelete: 'CASCADE',
  })
  productDetail: Variant;

  @Column({ type: 'enum', enum: StockMovementType })
  type: StockMovementType;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: StockMovementReason,  
    default: StockMovementReason.MANUAL_ADJUSTMENT,
  })
  reason: StockMovementReason;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.stockMovements, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  supplier?: Supplier | null; // Allowing null explicitly here

  @ManyToOne(() => SupplyOrder, { nullable: true })
  supplierOrder?: SupplyOrder | null;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  stockMovement: { id: string };
}
