import { LoginModel } from "./loginModel";

export interface RegisterForCorporateModel extends LoginModel{
    phoneNumber: string;
    address: string;
    companyName: string;
    taxNumber: string;
}