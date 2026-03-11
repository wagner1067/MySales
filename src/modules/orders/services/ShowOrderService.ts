import AppError from "@shared/errors/AppError";
import { orderRepositories } from "../database/repositories/OrderRepositories";
import { Order } from "../database/entities/Order";

export class ShowOrderService {
  async execute(id: string): Promise<Order> {
    const order = await orderRepositories.findById(Number(id));
    if (!order) {
      throw new AppError("Pedido nao encontrado", 404);
    }
    return order;
  }
}
