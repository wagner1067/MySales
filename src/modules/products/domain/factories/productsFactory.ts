import { ICreateProduct } from "@modules/products/domain/models/ICreateProduct";
import { IProductPaginate } from "@modules/products/domain/models/IProductPaginate";

export const makeProductData = (overrides?: Partial<ICreateProduct>): ICreateProduct => {
  return {
    name: "Produto Padrão Factory",
    price: 99.90,
    quantity: 10,
    ...overrides, 
  };
};

export const makeProductPaginate = (overrides?: Partial<IProductPaginate>): IProductPaginate => {
  return {
    current_page: 1,
    per_page: 10,
    total: 1,
    data: [
      {
          id: "id-ficticio-da-factory",
          name: "Produto vindo do Cache",
          price: 45.90,
          quantity: 12,
          created_at: new Date(),
          updated_at: new Date(),
      }
    ],
    ...overrides, 
  };
};