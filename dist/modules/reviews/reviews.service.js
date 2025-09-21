"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const review_repository_1 = require("./repositories/review.repository");
const products_service_1 = require("../products/products.service");
let ReviewsService = class ReviewsService {
    constructor(reviewRepository, productsService) {
        this.reviewRepository = reviewRepository;
        this.productsService = productsService;
    }
    async createReview(createReviewDto) {
        const product = await this.productsService.getProductById(createReviewDto.productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const existingReview = await this.reviewRepository.findOneOrDefault({
            user: { id: createReviewDto.userId },
            product: { id: createReviewDto.productId },
        });
        let review;
        if (existingReview) {
            review = await this.reviewRepository.findOneAndUpdate({ id: existingReview.id }, {
                title: createReviewDto.title,
                comment: createReviewDto.comment,
                rating: createReviewDto.rating,
            });
        }
        else {
            review = await this.reviewRepository.create({
                title: createReviewDto.title,
                comment: createReviewDto.comment,
                rating: createReviewDto.rating,
                user: { id: createReviewDto.userId },
                product: { id: createReviewDto.productId },
            });
        }
        await this.productsService.updateProductReviewStats(createReviewDto.productId);
        return review;
    }
    async updateReview(reviewId, userId, updateReviewDto) {
        const review = await this.reviewRepository.findOne({ id: reviewId }, { relations: ['user'] });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.user.id !== userId) {
            throw new common_1.ForbiddenException('You can only update your own review');
        }
        return await this.reviewRepository.findOneAndUpdate({ id: reviewId }, updateReviewDto);
    }
    async deleteReview(reviewId, userId) {
        const review = await this.reviewRepository.findOne({ id: reviewId }, { relations: ['user'] });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.user.id !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own review');
        }
        await this.reviewRepository.findOneAndDelete({ id: reviewId });
        return { message: 'Review deleted successfully' };
    }
    async getProductReviews(productId, page = 1, limit = 10) {
        await this.productsService.getProductById(productId);
        const [data, total] = await this.reviewRepository.findAndCountWithPagination({
            where: { product: { id: productId } },
            relations: ['user'],
            order: { reviewDate: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async getProductAverageRating(productId) {
        await this.productsService.getProductById(productId);
        const reviews = await this.reviewRepository.findAll({
            where: { product: { id: productId } },
        });
        if (reviews.length === 0)
            return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return parseFloat((sum / reviews.length).toFixed(2));
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [review_repository_1.ReviewRepository,
        products_service_1.ProductsService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map