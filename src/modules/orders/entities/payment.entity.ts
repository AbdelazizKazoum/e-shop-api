/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  order: Order;

  @Column()
  methode: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';

  @Column()
  status: 'pending' | 'fulfilled' | 'rejected';

  @Column()
  date: Date;
}
