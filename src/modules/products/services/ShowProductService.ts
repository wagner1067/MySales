import AppError from "@shared/errors/AppError";
import { Product } from "../database/entities/Product";
import { productsRepositories } from "../database/repositories/ProductsRepositories";

interface IShowProduct {
  id: string;
}

export default class ShowProductService {
  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await productsRepositories.findById(id);
    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }
    return product;
  }
}
