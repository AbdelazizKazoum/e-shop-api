/* eslint-disable prettier/prettier */
// product-review.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn()
  product: Product;

  @Column({ type: 'int', width: 1 })
  rating: number; // from 1 to 5

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  reviewDate: Date;
}
