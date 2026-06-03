import { IOrder } from "@modules/orders/domain/models/IOrder";

export const makeOrderData = (overrides?: Partial<IOrder>): IOrder => {
  return {
    id: "1",
    customer: {
      id: 1,
      name: "Cliente Teste",
      email: "cliente@teste.com",
      created_at: new Date(),
      updated_at: new Date(),
    },
    order_products: [
      {
        product_id: "id-produto-1",
        price: 50.0,
        quantity: 2,
      }
    ],
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
};