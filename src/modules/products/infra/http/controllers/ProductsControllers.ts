import { Request, Response } from "express";
import DeleteProductService from "@modules/products/services/DeleteProductService";
import ListProductService from "@modules/products/services/ListProductService";
import ShowProductService from "@modules/products/services/ShowProductService";
import UpdateProductService from "@modules/products/services/UpdateProductService";
import { container } from "tsyringe";
import { CreateProductService } from "@modules/products/services/CreateProductService";

export default class ProductsControllers {
  async index(request: Request, response: Response): Promise<Response> {
    const listProductsService = container.resolve(ListProductService);
    const products = await listProductsService.execute();
    return response.json(products);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showProductService = container.resolve(ShowProductService);
    const product = await showProductService.execute({ id });
    return response.json(product);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name,
      price,
      quantity,
    });
    return response.json(product);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, price, quantity } = request.body;
    const updateProductService = container.resolve(UpdateProductService);
    const product = await updateProductService.execute({
      id,
      name,
      price,
      quantity,
    });
    return response.json(product);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteProductService = container.resolve(DeleteProductService);
    await deleteProductService.execute({ id });
    return response.status(204).send([]);
  }
}
