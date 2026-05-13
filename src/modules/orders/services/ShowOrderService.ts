import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IOrder } from "../domain/models/IOrder";
import { IOrdersRepositories } from "../domain/repositories/IOrdersRepositories";

interface IRequest {
  id: number;
}
@injectable()
class ShowOrderService {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepositories,
  ) {}
  public async execute({ id }: IRequest): Promise<IOrder> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new AppError("Order not found.");
    }

    return order;
  }
}

export default ShowOrderService;
