import { AuthService } from './auth.service';
import { R2Service } from '../storage/r2.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly r2Service;
    constructor(authService: AuthService, r2Service: R2Service);
    register(payload: string): Promise<import("./dto/login-response.dto").AuthResponseDto>;
    login(loginDto: LoginDto): Promise<import("./dto/login-response.dto").AuthResponseDto>;
    oauthLogin(data: any): Promise<import("./dto/login-response.dto").AuthResponseDto>;
    getProfile(req: any): Promise<any>;
    refresh(refreshToken: string): Promise<import("./dto/login-response.dto").AuthResponseDto>;
}
