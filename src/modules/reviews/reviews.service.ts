/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewRepository } from './repositories/review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ProductsService } from 'src/modules/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productsService: ProductsService,
  ) {}

  // =================================================================
  // === CREATE REVIEW ============================================= =
  // =================================================================
  /**
   * Create a review for a product.
   * - Checks if the product exists using ProductsService.
   * - Prevents duplicate reviews from the same user for the same product.
   */
  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const product = await this.productsService.getProductById(
      createReviewDto.productId,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingReview = await this.reviewRepository.findOneOrDefault({
      user: { id: createReviewDto.userId } as any,
      product: { id: createReviewDto.productId } as any,
    });

    let review: Review;
    if (existingReview) {
      // Update the existing review
      review = await this.reviewRepository.findOneAndUpdate(
        { id: existingReview.id },
        {
          title: createReviewDto.title,
          comment: createReviewDto.comment,
          rating: createReviewDto.rating,
        },
      );
    } else {
      // Create a new review
      review = await this.reviewRepository.create({
        title: createReviewDto.title,
        comment: createReviewDto.comment,
        rating: createReviewDto.rating,
        user: { id: createReviewDto.userId } as any,
        product: { id: createReviewDto.productId } as any,
      });
    }

    // Update product stats after review creation/update
    await this.productsService.updateProductReviewStats(
      createReviewDto.productId,
    );

    return review;
  }

  // =================================================================
  // === UPDATE REVIEW ============================================= =
  // =================================================================
  /**
   * Update a review.
   * - Only allows the review owner to update.
   */
  async updateReview(
    reviewId: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne(
      { id: reviewId },
      { relations: ['user'] },
    );
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.user.id !== userId) {
      throw new ForbiddenException('You can only update your own review');
    }
    return await this.reviewRepository.findOneAndUpdate(
      { id: reviewId },
      updateReviewDto,
    );
  }

  // =================================================================
  // === DELETE REVIEW ============================================= =
  // =================================================================
  /**
   * Delete a review.
   * - Only allows the review owner to delete.
   */
  async deleteReview(
    reviewId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOne(
      { id: reviewId },
      { relations: ['user'] },
    );
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own review');
    }
    await this.reviewRepository.findOneAndDelete({ id: reviewId });
    return { message: 'Review deleted successfully' };
  }

  // =================================================================
  // === GET PRODUCT REVIEWS ======================================== =
  // =================================================================
  /**
   * Get paginated reviews for a product.
   * @param productId - Product ID
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Paginated reviews and meta info
   */
  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    await this.productsService.getProductById(productId);

    const [data, total] =
      await this.reviewRepository.findAndCountWithPagination({
        where: { product: { id: productId } as any },
        relations: ['user'],
        order: { reviewDate: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

    return { data, total, page, limit };
  }

  // =================================================================
  // === GET PRODUCT AVERAGE RATING ================================== =
  // =================================================================
  /**
   * Get average rating and review count for a product.
   */
  async getProductAverageRating(
    productId: string,
  ): Promise<{ rating: number; reviewCount: number }> {
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      rating: product.rating ?? 0,
      reviewCount: product.reviewCount ?? 0,
    };
  }
}
