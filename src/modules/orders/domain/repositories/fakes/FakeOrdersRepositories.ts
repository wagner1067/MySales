import { IOrdersRepositories } from "@modules/orders/domain/repositories/IOrdersRepositories";
import { ICreateOrder } from "@modules/orders/domain/models/ICreateOrder";
import { IOrder } from "@modules/orders/domain/models/IOrder";
import { IOrderPaginate } from "@modules/orders/domain/models/IOrderPaginate";
import { Order } from "@modules/orders/infra/database/entities/Order";

export default class FakeOrdersRepository implements IOrdersRepositories {
  private orders: Order[] = [];

  public async findById(id: number): Promise<IOrder | null> {
    const order = this.orders.find((order) => order.id === id);
    return (order as unknown as IOrder) || null;
  }

  public async create({ customer, products }: ICreateOrder): Promise<IOrder> {
    const order = new Order();

    order.id = this.orders.length + 1; 
    order.customer = customer;
    order.order_products = products as any; 
    
    order.created_at = new Date();
    order.updated_at = new Date();

    this.orders.push(order);

    return order as unknown as IOrder;
  }

  public async findAll({ page, skip, take }: { page: number; skip: number; take: number }): Promise<IOrderPaginate> {
    const ordersPaginated = this.orders.slice(skip, skip + take);

    return {
      current_page: page,
      per_page: take,
      total: this.orders.length,
      data: ordersPaginated as unknown as IOrder[],
    };
  }
}