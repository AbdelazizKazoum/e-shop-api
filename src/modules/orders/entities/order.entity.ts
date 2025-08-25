/* eslint-disable prettier/prettier */
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Address } from 'src/modules/users/entities/address.entity';
import { Payment } from './payment.entity';
import { OrderItem } from './orderItem.entity';

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User;

  @Column()
  date_commande: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @Column()
  total: number;

  @OneToMany(() => OrderItem, (item) => item.order)
  @JoinColumn()
  details: OrderItem[];

  @ManyToOne(() => Address)
  @JoinColumn()
  address: Address;

  @OneToOne(() => Payment, (payment) => payment.order, { nullable: true })
  @JoinColumn()
  payment: Payment;
}
