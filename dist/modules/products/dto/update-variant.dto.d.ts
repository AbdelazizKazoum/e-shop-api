declare const SIZES: readonly ["SM", "M", "L", "XL", "XXL", "3XL", "4XL"];
type Size = (typeof SIZES)[number];
export declare class UpdateVariantDto {
    color?: string;
    size?: Size;
    qte?: number;
    deletedImages?: string[];
}
export {};
