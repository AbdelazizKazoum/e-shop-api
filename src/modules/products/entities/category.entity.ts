/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category?: string;

  @Column()
  displayText: string;

  @Column({ default: true })
  imageUrl?: string;

  @OneToMany(() => Product, (product) => product.category)
  @JoinColumn()
  products?: Product[];
}
