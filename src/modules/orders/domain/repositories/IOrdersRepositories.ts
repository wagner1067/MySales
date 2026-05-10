import { ICreateOrder } from "../models/ICreateOrder";
import { IOrder } from "../models/IOrder";
import { IOrderPaginate } from "../models/IOrderPaginate";

type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export interface IOrdersRepositories {
  findById(id: number): Promise<IOrder | null>;
  findAll({ page, skip, take }: SearchParams): Promise<IOrderPaginate>;
  create(data: ICreateOrder): Promise<IOrder>;
}
