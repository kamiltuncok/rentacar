import { CustomerType } from './rental';
export interface CorporateUser{
    id:number;
    phoneNumber: string;
    email: string;
    address: string;
    companyName: string;
    taxNumber: string;
    status:boolean;
    customerType: CustomerType;
}