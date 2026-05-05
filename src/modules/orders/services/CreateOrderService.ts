import { Order } from "../infra/database/entities/Order";
import { customerRepositories } from "@modules/customers/infra/database/repositories/CustomerRepositories";
import AppError from "@shared/errors/AppError";
import { productsRepositories } from "@modules/products/infra/database/repositories/ProductsRepositories";
import { orderRepositories } from "../infra/database/repositories/OrderRepositories";
import { ICreateOrder } from "../domain/ICreateOrder";

export default class CreateOrderService {
  async execute({ customer_id, products }: ICreateOrder): Promise<Order> {
    const customerExists = await customerRepositories.findById(
      Number(customer_id),
    );

    if (!customerExists) {
      throw new AppError("não existe um cliente com esse id", 404);
    }

    const existsProducts = await productsRepositories.findAllByIds(products);

    if (existsProducts.length !== products.length) {
      throw new AppError("um ou mais produtos não foram encontrados", 404);
    }

    const existsProductsIds = products.map((product) => product.id);
    const checkInexistentProducts = products.filter(
      (product) => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `produto(s) ${checkInexistentProducts[0].id} não encontrado(s)`,
        404,
      );
    }

    const quantityAvailable = products.filter(
      (product) =>
        existsProducts.filter(
          (productsExisten) => productsExisten.id === product.id,
        )[0].quantity < product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `produto(s) ${quantityAvailable[0].id} fora de estoque`,
        409,
      );
    }

    const serializedProducts = products.map((product) => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(
        (productsExisten) => productsExisten.id === product.id,
      )[0].price,
    }));

    const order = await orderRepositories.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updateProductQuatity = order_products.map((product) => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(
          (productsExisten) => productsExisten.id === product.product_id,
        )[0].quantity - product.quantity,
    }));

    await productsRepositories.save(updateProductQuatity);

    return order;
  }
}
