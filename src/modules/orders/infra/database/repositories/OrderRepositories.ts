import { Repository } from "typeorm";
import { ICreateOrder } from "@modules/orders/domain/models/ICreateOrder";
import { IOrderPaginate } from "@modules/orders/domain/models/IOrderPaginate";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { IOrder } from "@modules/orders/domain/models/IOrder";
import { Order } from "../entities/Order";
import { IOrdersRepositories } from "@modules/orders/domain/repositories/IOrdersRepositories";

type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

class OrdersRepository implements IOrdersRepositories {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Order);
  }

  public async findById(id: number): Promise<IOrder | null> {
    const order = this.ormRepository.findOne({
      where: { id: Number(id) },
      relations: ["order_products", "customer"],
    });

    return order as unknown as IOrder;
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IOrderPaginate> {
    const [orders, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      per_page: take,
      total: count,
      current_page: page,
      data: orders,
    };

    return result as unknown as IOrderPaginate;
  }

  public async create({ customer, products }: ICreateOrder): Promise<IOrder> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    await this.ormRepository.save(order);

    return order as unknown as IOrder;
  }
}

export default OrdersRepository;
