/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { jwtConstants } from 'src/shared/constants/jwt.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';
import { R2Service } from '../storage/r2.service';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.jwtTokenSecret,
      signOptions: jwtConstants.jwtExpirationTime
        ? { expiresIn: jwtConstants.jwtExpirationTime }
        : undefined,
    }),
    UsersModule,
    StorageModule,
  ],
  exports: [PassportModule, JwtModule, JwtAuthGuard],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard, AuthService, R2Service],
})
export class AuthModule {}
