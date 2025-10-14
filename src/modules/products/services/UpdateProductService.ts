import AppError from "@shared/errors/AppError";
import { Product } from "../database/entities/Product";
import { productsRepositories } from "../database/repositories/ProductsRepositories";

interface IUpdateProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default class UpdateProductService {
  async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<Product> {
    const product = await productsRepositories.findById(id);
    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    /*const productExists = await productsRepositories.findByName(name);

    if (productExists) {
      throw new AppError("Produto já com esse nome cadastrado", 409);
    }

    product.name = name;*/ //Não pode alterar o nome do produto para evitar confusão no estoque
    product.price = price;
    product.quantity = quantity;

    await productsRepositories.save(product);

    return product;
  }
}
