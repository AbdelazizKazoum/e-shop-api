/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [DatabaseModule.forFeature([User, Address])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
