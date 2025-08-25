/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Variant } from './variant.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  image: string;

  @ManyToOne(() => Variant, (detail) => detail.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  variant: Variant;
}
