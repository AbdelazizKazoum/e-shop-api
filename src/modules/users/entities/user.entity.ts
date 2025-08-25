/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Review } from 'src/modules/products/entities/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ type: 'text', nullable: true })
  username: string;

  @Column()
  cin: string;

  @Column({ nullable: true })
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  tel: number;

  @Column()
  password: string;

  @Column()
  role: 'admin' | 'client';

  @Column({ nullable: true })
  primaryAddress: string;

  @Column({ default: 'Active' })
  status: string;

  @Column({ nullable: true })
  date_inscription: Date;

  @OneToMany(() => Address, (address) => address.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  addressList: Address[];

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn()
  orders: Order[];

  @OneToMany(() => Review, (rec) => rec.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  reviews: Review[];

  @OneToMany(() => StockMovement, (stockMovement) => stockMovement.user)
  stockMovements: StockMovement[];
}
