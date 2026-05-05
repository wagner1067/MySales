import AppError from "@shared/errors/AppError";
import { Product } from "../infra/database/entities/Product";
import { productsRepositories } from "../infra/database/repositories/ProductsRepositories";
import { IShowProduct } from "../domain/models/IShowProduct";

export default class ShowProductService {
  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await productsRepositories.findById(id);
    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }
    return product;
  }
}
