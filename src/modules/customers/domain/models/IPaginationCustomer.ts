import { ICustomer } from "./ICustomer";

export interface IPaginationCustomer {
  per_age: number;
  total: number;
  current_page: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
  data: ICustomer[];
}
