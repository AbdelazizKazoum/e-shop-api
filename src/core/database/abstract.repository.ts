/* eslint-disable prettier/prettier */
import {
  FindOptionsWhere,
  Repository,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  constructor(protected readonly entityRepository: Repository<T>) {}

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.entityRepository.create(entity);
    return this.entityRepository.save(newEntity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    options?: Omit<FindManyOptions<T>, 'where'>,
  ): Promise<T> {
    const entity = await this.entityRepository.findOne({ where, ...options });
    return entity;
  }

  async findOneOrDefault(
    where: FindOptionsWhere<T>,
    options?: Omit<FindManyOptions<T>, 'where'>,
  ): Promise<T | null> {
    return this.entityRepository.findOne({ where, ...options });
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.entityRepository.find(options);
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: Partial<T>,
  ): Promise<T> {
    const entity = await this.findOne(where);
    Object.assign(entity, partialEntity);
    return this.entityRepository.save(entity);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<void> {
    const result = await this.entityRepository.delete(where);
    if (result.affected === 0) {
      throw new NotFoundException('Entity not found for deletion.');
    }
  }

  async findAndCountWithPagination(options: any): Promise<[T[], number]> {
    return this.entityRepository.findAndCount(options);
  }
}
