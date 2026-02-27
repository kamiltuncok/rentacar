import { CustomerType } from './rental';

export interface Customer {
    id: number;
    phoneNumber: string;
    email: string;
    address: string;
    customerType: CustomerType;
    userId: number | null;
    createdDate: Date;
}