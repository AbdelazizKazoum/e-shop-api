/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { jwtConstants } from 'src/shared/constants/jwt.constants';

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
  ],
  exports: [PassportModule, JwtModule, JwtAuthGuard],
  controllers: [],
  providers: [JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
