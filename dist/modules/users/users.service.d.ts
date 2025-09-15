import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(page?: number, limit?: number, filters?: {
        email?: string;
        username?: string;
        status?: string;
        role?: string;
        provider?: string;
        firstName?: string;
        lastName?: string;
    }): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, relations?: string[]): Promise<User>;
    findByEmail(email: string, relations?: string[]): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
}
