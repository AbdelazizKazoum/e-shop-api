/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Product } from './product.entity';
import { StockMovement } from 'src/modules/stock-movements/entities/stock-movement.entity';
import { SupplyOrderItem } from 'src/modules/supply-orders/entities/supplyOrderItem.entity';
import { Stock } from './stock.entity';
import { Image } from './image.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  color?: string;

  @Column()
  size: 'SM' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | '4XL';

  @Column()
  qte: number;

  @ManyToOne(() => Product, (prod) => prod.variants, {
    nullable: false,
    onDelete: 'CASCADE', // This ensures cascading delete on detailProduct when a product is deleted
  })
  @JoinColumn()
  product: Product;

  @OneToMany(() => Image, (img) => img.variant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  images: Image[];

  @OneToMany(() => StockMovement, (movement) => movement.productDetail)
  @JoinColumn()
  movements?: StockMovement[];

  @OneToMany(() => SupplyOrderItem, (orderItem) => orderItem.variant)
  @JoinColumn()
  orderItems?: SupplyOrderItem[];

  @OneToOne(() => Stock, (stock) => stock.variant)
  @JoinColumn()
  stock?: Stock;
}
