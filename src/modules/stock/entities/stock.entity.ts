/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Variant } from '../../products/entities/variant.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Variant, (detail) => detail.stock)
  @JoinColumn()
  variant: Variant;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: new Date().toLocaleDateString() })
  createAt: string;

  @Column({ default: new Date().toLocaleDateString() })
  updated: string;
}
