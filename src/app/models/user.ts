import { CustomerType } from './rental';
export interface User{
    id:number;
    firstName:string;
    lastName:string;
    email:string;
    identityNumber:string;
    phoneNumber:string;
    address:string;
    status:boolean;
    customerType: CustomerType;
}