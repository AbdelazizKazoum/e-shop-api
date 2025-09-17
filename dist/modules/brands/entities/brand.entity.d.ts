import { Product } from '../../products/entities/product.entity';
export declare class Brand {
    id: string;
    name: string;
    imageUrl?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    products?: Product[];
}
