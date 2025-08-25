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

@Entity()
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  color: string;

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

  @OneToMany(() => Images, (img) => img.variant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  images: Images[];

  @OneToMany(() => StockMovement, (movement) => movement.productDetail)
  @JoinColumn()
  movements: StockMovement[];

  @OneToMany(() => SupplierOrderItem, (orderItem) => orderItem.detail_product)
  @JoinColumn()
  orderItems: SupplierOrderItem[];

  @OneToOne(() => Stock, (stock) => stock.productDetail)
  @JoinColumn()
  stock: Stock;
}
