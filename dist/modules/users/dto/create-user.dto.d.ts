export declare class CreateUserDto {
    email: string;
    username?: string;
    cin?: string;
    image?: string;
    firstName?: string;
    lastName?: string;
    tel?: number;
    password: string;
    role: 'admin' | 'client';
    primaryAddress?: string;
    status?: string;
    created_at?: Date;
    provider?: string;
    providerId?: string;
}
