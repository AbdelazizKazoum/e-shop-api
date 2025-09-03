/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  zipCode: string;

  @Column()
  country: string;

  @Column()
  addressType: 'Home' | 'Work' | 'Other';

  @ManyToOne(() => User, (user) => user.addressList, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({})
  user?: User;
}
