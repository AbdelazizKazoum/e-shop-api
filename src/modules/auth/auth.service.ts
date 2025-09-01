/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ Register user (local strategy)
  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; access_token: string; refresh_token: string }> {
    const existingUser = await this.usersService
      .findByEmail(registerDto.email)
      .catch(() => null);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      role: 'client',
      provider: 'local',
      created_at: new Date(),
    });

    return this.generateTokens(user);
  }

  // ✅ Login user (local strategy)
  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; access_token: string; refresh_token: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || user.provider !== 'local') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  // ✅ OAuth login/registration
  async validateOAuthLogin(profile: {
    email: string;
    provider: string;
    providerId: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  }): Promise<{ user: User; access_token: string; refresh_token: string }> {
    let user = await this.usersService
      .findByEmail(profile.email)
      .catch(() => null);

    if (!user) {
      // Auto-register new OAuth user
      user = await this.usersService.create({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        image: profile.image,
        provider: profile.provider,
        providerId: profile.providerId,
        password: '', // no password for OAuth
        role: 'client',
        created_at: new Date(),
      });
    }

    return this.generateTokens(user);
  }

  // ✅ Used by Passport strategies
  async validateUser(email: string, pass?: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    if (user.provider !== 'local') {
      return user; // OAuth user (no password check)
    }

    if (pass && (await bcrypt.compare(pass, user.password))) {
      return user;
    }

    return null;
  }

  // 🔑 Generate both access and refresh tokens
  private generateTokens(user: User): {
    access_token: string;
    refresh_token: string;
    user: User;
  } {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      provider: user.provider,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m', // access token expiry
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d', // refresh token expiry
    });

    return { user, access_token, refresh_token };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.validateUser(decoded.email);
      if (!user) throw new UnauthorizedException('User not found');

      const access_token = this.jwtService.sign(
        { email: user.email, sub: user.id },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      );

      const new_refresh_token = this.jwtService.sign(
        { email: user.email, sub: user.id },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      );

      return { access_token, refresh_token: new_refresh_token };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
