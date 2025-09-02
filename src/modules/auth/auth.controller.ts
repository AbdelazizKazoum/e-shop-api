/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { R2Service } from '../storage/r2.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly r2Service: R2Service, // Cloudflare R2 or storage service
  ) {}

  // ✅ Register
  @Post('register')
  @UseInterceptors(FileInterceptor('image')) // if you have a file field
  async register(@Body('data') payload: string) {
    const registerDto: RegisterDto = JSON.parse(payload);
    return this.authService.register(registerDto);
  }

  // ✅ Login
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('🚀 ~ AuthController ~ login ~ loginDto:', loginDto);
    // Returns { user, access_token, refresh_token }

    return this.authService.login(loginDto);
  }

  // ✅ OAuth Login
  @Post('oauth')
  async oauthLogin(@Body() data: any) {
    const result = await this.authService.validateOAuthLogin(data);
    if (!result) throw new UnauthorizedException('OAuth login failed');
    return result; // { user, access_token, refresh_token }
  }

  // ✅ Protected route (test JWT)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user; // Extracted from JWT payload
  }

  // ✅ Refresh token endpoint
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
