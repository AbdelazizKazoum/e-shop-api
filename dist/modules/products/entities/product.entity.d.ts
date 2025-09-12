import { Category } from './category.entity';
import { Variant } from './variant.entity';
import { Review } from './review.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    brand: string;
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
