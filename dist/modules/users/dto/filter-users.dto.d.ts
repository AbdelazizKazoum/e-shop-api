export declare class FilterUsersDto {
    email?: string;
    username?: string;
    status?: string;
    role?: 'admin' | 'client';
    page?: number;
    limit?: number;
}
