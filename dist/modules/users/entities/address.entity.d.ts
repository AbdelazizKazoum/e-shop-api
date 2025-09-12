import { User } from './user.entity';
export declare class Address {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    zipCode: string;
    country: string;
    addressType: 'Home' | 'Work' | 'Other';
    user?: User;
}
