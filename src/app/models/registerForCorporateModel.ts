import { LoginModel } from "./loginModel";

export interface RegisterForCorporateModel extends LoginModel {
    phoneNumber: string;
    companyName: string;
    taxNumber: string;
}