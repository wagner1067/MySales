import { ICreateOrderProduct } from "../ICreateOrderProduct";
import { ICustomer } from "@modules/customers/domain/models/ICustomer";

export interface ICreateOrder {
  customer: ICustomer;
  products: ICreateOrderProduct[];
}
