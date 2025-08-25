/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Variant } from 'src/modules/products/entities/variant.entity';

@Entity()
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn()
  order?: Order;

  // @ManyToOne(() => Product)
  // @JoinColumn()
  // product: Product;

  @ManyToOne(() => Variant)
  @JoinColumn()
  variant: Variant;

  @Column()
  prix_vente: number;

  @Column()
  prix_unitaire: number;

  @Column()
  quantite: number;

  @Column()
  sous_total: number;
}
