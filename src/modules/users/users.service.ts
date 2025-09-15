/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { FindManyOptions, ILike, Between } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  // ✅ Create user with try/catch
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.create({
        ...createUserDto,
        created_at: new Date(),
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create user: ${error.message}`,
      );
    }
  }

  // ✅ Find all with pagination + filters
  async findAll(
    page = 1,
    limit = 10,
    filters?: {
      email?: string;
      status?: string;
      role?: string;
      provider?: string;
      customer?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    console.log('🚀 ~ UsersService ~ findAll ~ filters:', filters);
    const skip = (page - 1) * limit;

    const baseFilters: any = {};
    if (filters?.email) baseFilters.email = ILike(`%${filters.email}%`);
    if (filters?.status) baseFilters.status = filters.status;
    if (filters?.role) baseFilters.role = filters.role;
    if (filters?.provider) baseFilters.provider = filters.provider;

    if (filters?.startDate && filters?.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      // To include the whole end day, set time to the end of the day
      endDate.setHours(23, 59, 59, 999);
      baseFilters.created_at = Between(startDate, endDate);
    }

    let where: any = baseFilters;

    if (filters?.customer) {
      const customerSearch = ILike(`%${filters.customer}%`);
      where = [
        { ...baseFilters, firstName: customerSearch },
        { ...baseFilters, lastName: customerSearch },
      ];
    }

    const options: FindManyOptions<User> = {
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    };

    const [data, total] =
      await this.userRepository.findAndCountWithPagination(options);

    return { data, total, page, limit };
  }

  // ✅ Find by ID
  async findOne(id: string, relations: string[] = []): Promise<User> {
    const user = await this.userRepository.findOne(
      {
        id,
      },
      { relations },
    );
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // ✅ Find by Email
  async findByEmail(email: string, relations: string[] = []): Promise<User> {
    const user = await this.userRepository.findOne(
      {
        email,
      },
      { relations },
    );
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // ✅ Update with try/catch
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // First, check if the user exists to provide a clear error message.
      const existingUser = await this.userRepository.findOne({ id });
      if (!existingUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const user = await this.userRepository.findOneAndUpdate(
        { id },
        updateUserDto,
      );
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update user with id ${id}: ${error.message}`,
      );
    }
  }

  // ✅ Delete
  async remove(id: string): Promise<void> {
    await this.userRepository.findOneAndDelete({ id });
  }
}
