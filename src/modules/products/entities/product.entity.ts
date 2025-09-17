/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Category } from './category.entity';
import { Variant } from './variant.entity';
import { Review } from './review.entity';
import { Brand } from 'src/modules/brands/entities/brand.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true })
  @JoinColumn()
  brand?: Brand;

  @Column()
  gender: string;

  @Column({ default: 0 })
  quantity?: number;

  @Column()
  image?: string;

  @Column({ type: 'float', default: 0 })
  rating?: number;

  @Column({ type: 'int', default: 0 })
  reviewCount?: number;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ type: 'float', nullable: true })
  newPrice?: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
  })
  status?: 'active' | 'inactive' | 'archived';

  @Column({ default: false })
  trending?: boolean;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ default: new Date().toLocaleDateString() })
  createAt?: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @OneToMany(() => Variant, (detail) => detail.product, {
    cascade: true,
  })
  variants?: Variant[];

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews?: Review[];

  @Column({ type: 'float', default: 0 })
  averageRating?: number;
}
