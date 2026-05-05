import AppError from "@shared/errors/AppError";
import { Product } from "../infra/database/entities/Product";
import { productsRepositories } from "../infra/database/repositories/ProductsRepositories";
import RedisCache from "@shared/cache/RedisCache";
import { ICreateProduct } from "../domain/models/ICreateProduct";

export default class CreateProductService {
  async execute({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const productExists = await productsRepositories.findByName(name);
    const redisCache = new RedisCache();

    if (productExists) {
      throw new AppError("Produto já com esse nome cadastrado", 409);
    }

    const product = productsRepositories.create({
      name,
      price,
      quantity,
    });

    await productsRepositories.save(product);

    await redisCache.invalidate("api-mysales-PRODUCT_LIST");

    return product;
  }
}
