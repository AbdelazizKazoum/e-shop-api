import { FindOptionsWhere, Repository, FindManyOptions, DeepPartial } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
export declare abstract class AbstractRepository<T extends AbstractEntity<T>> {
    protected readonly entityRepository: Repository<T>;
    constructor(entityRepository: Repository<T>);
    create(entity: DeepPartial<T>): Promise<T>;
    findOne(where: FindOptionsWhere<T>, options?: Omit<FindManyOptions<T>, 'where'>): Promise<T>;
    findOneOrDefault(where: FindOptionsWhere<T>, options?: Omit<FindManyOptions<T>, 'where'>): Promise<T | null>;
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: Partial<T>): Promise<T>;
    findOneAndDelete(where: FindOptionsWhere<T>): Promise<void>;
    findAndCountWithPagination(options: any): Promise<[T[], number]>;
}
