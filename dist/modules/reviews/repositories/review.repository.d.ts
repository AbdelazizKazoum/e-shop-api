import { Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
export declare class ReviewRepository extends AbstractRepository<Review> {
    private readonly reviewRepository;
    protected readonly logger: Logger;
    constructor(reviewRepository: Repository<Review>);
}
