export declare enum AddressType {
    HOME = "Home",
    WORK = "Work",
    OTHER = "Other"
}
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    PAYPAL = "paypal",
    BANK_TRANSFER = "bank_transfer",
    CASH_ON_DELIVERY = "Cash-on-Delivery"
}
export declare class UserDto {
    name?: string;
}
export declare class ContactInfoDto {
    phone: string;
    email: string;
    newsAndOffers?: boolean;
}
export declare class ShippingAddressDto {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    addressType: AddressType;
}
export declare class PaymentInfoDto {
    method: PaymentMethod;
}
export declare class OrderItemDto {
    productId: string;
    variantId: string;
    name: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    user?: UserDto;
    contactInfo: ContactInfoDto;
    shippingAddress: ShippingAddressDto;
    paymentInfo: PaymentInfoDto;
    items: OrderItemDto[];
    totalAmount: number;
}
