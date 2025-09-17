import { Category } from './category.entity';
import { Variant } from './variant.entity';
import { Review } from './review.entity';
import { Brand } from 'src/modules/brands/entities/brand.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    brand?: Brand;
    gender: string;
    quantity?: number;
    image?: string;
    rating?: number;
    reviewCount?: number;
    price: number;
    newPrice?: number;
    status?: 'active' | 'inactive' | 'archived';
    trending?: boolean;
    tags?: string[];
    createAt?: string;
    category: Category;
    variants?: Variant[];
    reviews?: Review[];
    averageRating?: number;
}
