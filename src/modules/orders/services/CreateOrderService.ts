import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { ICustomersRepository } from "@modules/customers/domain/repositories/ICustomersRepositories";
import { IProductsRepository } from "@modules/products/domain/repositories/IProductsRepository";
import { IOrder } from "../domain/models/IOrder";
import { IOrdersRepositories } from "../domain/repositories/IOrdersRepositories";

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}
@injectable()
class CreateOrderService {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepositories,
    @inject("CustomersRepository")
    private customersRepository: ICustomersRepository,
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({ customer_id, products }: IRequest): Promise<IOrder> {
    const customerExists = await this.customersRepository.findById(
      Number(customer_id),
    );

    if (!customerExists) {
      throw new AppError("Could not find any customer with the given id.", 404);
    }

    const existsProducts = await this.productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError(
        "Could not find any products with the given ids.",
        404,
      );
    }

    const existsProductsIds = existsProducts.map((product) => product.id);

    const checkInexistentProducts = products.filter(
      (product) => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}.`,
        404,
      );
    }

    const quantityAvailable = products.filter(
      (product) =>
        existsProducts.filter((p) => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (!quantityAvailable.length) {
      throw new AppError(`The quantity is not available for.`, 409);
    }

    const serializedProducts = products.map((product) => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter((p) => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map((product) => ({
      id: product.product_id,
      quantity:
        existsProducts.filter((p) => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateStock(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
