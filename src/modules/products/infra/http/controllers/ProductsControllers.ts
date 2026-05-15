import { Request, Response } from "express";

import ShowProductService from "@modules/products/services/ShowProductService";

import UpdateProductService from "@modules/products/services/UpdateProductService";
import DeleteProductService from "@modules/products/services/DeleteProductService";
import { container } from "tsyringe";
import ListProductService from "@modules/products/services/ListProductService";
import { CreateProductService } from "@modules/products/services/CreateProductService";

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page, skip, take } = request.query;
    const listProductsService = container.resolve(ListProductService);
    const products = await listProductsService.execute({
      page: page ? Number(page) : 1,
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 10,
    });

    return response.json(products);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showProductService = container.resolve(ShowProductService);

    const products = await showProductService.execute({ id });

    return response.json(products);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const createProductService = container.resolve(CreateProductService);

    const product = await createProductService.execute({
      name,
      price,
      quantity,
    });

    return response.json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
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

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteProductService = container.resolve(DeleteProductService);

    await deleteProductService.execute({ id });

    return response.status(204).send([]);
  }
}
