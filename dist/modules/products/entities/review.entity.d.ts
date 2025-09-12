import { Product } from './product.entity';
import { User } from 'src/modules/users/entities/user.entity';
export declare class Review {
    id: string;
    title: string;
    user: User;
    product: Product;
    rating: number;
    comment: string;
    reviewDate: Date;
}
