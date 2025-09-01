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
import { StockMovement } from 'src/modules/stock-movements/entities/stock-movement.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ type: 'text', nullable: true })
  username?: string;

  @Column({ nullable: true })
  cin?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  tel?: number;

  @Column()
  password: string;

  @Column()
  role: 'admin' | 'client';

  @Column({ nullable: true })
  primaryAddress?: string;

  @Column({ default: 'Active' })
  status?: string;

  @Column({ nullable: true })
  created_at: Date;

  @OneToMany(() => Address, (address) => address.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  addressList?: Address[];

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn()
  orders?: Order[];

  @OneToMany(() => Review, (rec) => rec.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  reviews?: Review[];

  @OneToMany(() => StockMovement, (stockMovement) => stockMovement.user)
  stockMovements?: StockMovement[];

  @Column({ nullable: true })
  provider?: string; // e.g. 'local', 'google', 'facebook'

  @Column({ nullable: true })
  providerId?: string; // e.g. Google/Facebook user ID
}
