import { Product } from './product.entity';
export declare class Category {
    id: string;
    category?: string;
    displayText: string;
    imageUrl?: string;
    products?: Product[];
}
