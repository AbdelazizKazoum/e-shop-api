export declare class AuthResponseDto {
    data: {
        sub: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role: string;
        provider: string;
    };
    access_token: string;
    refresh_token: string;
}
