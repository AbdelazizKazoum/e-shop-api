import { UsersService } from './../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AuthResponseDto } from './dto/login-response.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateOAuthLogin(profile: {
        email: string;
        provider: string;
        providerId: string;
        firstName?: string;
        lastName?: string;
        image?: string;
    }): Promise<AuthResponseDto>;
    validateUser(email: string, pass?: string): Promise<User | null>;
    private generateTokens;
    refreshToken(refreshToken: string): Promise<AuthResponseDto>;
}
