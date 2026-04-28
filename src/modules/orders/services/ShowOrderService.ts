import AppError from "@shared/errors/AppError";
import { orderRepositories } from "../database/repositories/OrderRepositories";
import { Order } from "../database/entities/Order";
import RedisCache from "@shared/cache/RedisCache";

export class ShowOrderService {
  async execute(id: string): Promise<Order> {
    const redisCache = new RedisCache();

    let order = await redisCache.recover<Order>(`api-mysales-ORDER_${id}`);

    if (!order) {
      order = await orderRepositories.findById(Number(id));

      await redisCache.save(`api-mysales-ORDER_${id}`, JSON.stringify(order));
    }
    //const order = await orderRepositories.findById(Number(id));
    if (!order) {
      throw new AppError("Pedido nao encontrado", 404);
    }
    return order;
  }
}
