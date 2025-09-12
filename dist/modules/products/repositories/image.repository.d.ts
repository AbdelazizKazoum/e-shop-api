import { Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
export declare class ImageRepository extends AbstractRepository<Image> {
    private readonly imageRepository;
    protected readonly logger: Logger;
    constructor(imageRepository: Repository<Image>);
}
