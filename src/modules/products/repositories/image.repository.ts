import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImageRepository extends AbstractRepository<Image> {
  protected readonly logger = new Logger(ImageRepository.name);
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {
    super(imageRepository);
  }
}
