/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { Variant } from '../entities/variant.entity';

@Injectable()
export class VariantRepository extends AbstractRepository<Variant> {
  protected readonly logger = new Logger(VariantRepository.name);
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
  ) {
    super(variantRepository);
  }
}
