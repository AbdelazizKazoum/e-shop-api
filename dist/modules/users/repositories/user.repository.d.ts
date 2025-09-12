import { Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/abstract.repository';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UserRepository extends AbstractRepository<User> {
    private readonly userRepository;
    protected readonly logger: Logger;
    constructor(userRepository: Repository<User>);
}
