import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ProductsService } from 'src/modules/products/products.service';
import { ReviewRepository } from './repositories/review.repository';
export declare class ReviewsService {
    private readonly reviewRepository;
    private readonly productsService;
    constructor(reviewRepository: ReviewRepository, productsService: ProductsService);
    createReview(createReviewDto: CreateReviewDto): Promise<Review>;
    updateReview(reviewId: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<Review>;
    deleteReview(reviewId: string, userId: string): Promise<{
        message: string;
    }>;
    getProductReviews(productId: string): Promise<Review[]>;
    getProductAverageRating(productId: string): Promise<number>;
}
