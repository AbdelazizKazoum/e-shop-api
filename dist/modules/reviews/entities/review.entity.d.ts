import { User } from 'src/modules/users/entities/user.entity';
import { Product } from 'src/modules/products/entities/product.entity';
export declare class Review {
    id: string;
    title: string;
    user: User;
    product: Product;
    rating: number;
    comment: string;
    reviewDate: Date;
}
