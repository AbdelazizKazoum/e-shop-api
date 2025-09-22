export declare class UpdateProductDto {
    name?: string;
    description?: string;
    brand?: string;
    gender?: string;
    price?: number;
    newPrice?: number;
    status?: 'active' | 'inactive' | 'archived';
    trending?: boolean;
    categoryId?: string;
    tags?: string[];
}
