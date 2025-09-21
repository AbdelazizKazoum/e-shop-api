import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto): Promise<import("./entities/review.entity").Review>;
    getProductReviews(productId: string, page?: number, limit?: number): Promise<{
        data: import("./entities/review.entity").Review[];
        total: number;
        page: number;
        limit: number;
    }>;
    getProductAverageRating(productId: string): Promise<number>;
    update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<import("./entities/review.entity").Review>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
