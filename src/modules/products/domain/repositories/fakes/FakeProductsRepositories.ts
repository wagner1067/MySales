import { Product } from "@modules/products/infra/database/entities/Product";
import { ICreateProduct } from "../../models/ICreateProduct";
import { IFindProducts } from "../../models/IFindProducts";
import { IProduct } from "../../models/IProduct";
import { IProductPaginate } from "../../models/IProductPaginate";
import { IUpdateStockProduct } from "../../models/IUpdateStockProduct";
import { IProductsRepository } from "../IProductsRepository";

export default class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async findByName(name: string): Promise<IProduct | null> {
    const product = this.products.find((product) => product.name === name);
    return (product as unknown as IProduct) || null;
  }

  public async findById(id: string): Promise<IProduct | null> {
    const product = this.products.find((product) => product.id === id);
    return (product as unknown as IProduct) || null;
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct> {
    const product = new Product();

    product.id = Math.random().toString(36).substr(2, 9);
    product.name = name;
    product.price = price;
    product.quantity = quantity;

    this.products.push(product);

    return product as unknown as IProduct;
  }

  public async save(product: Product): Promise<IProduct> {
    const findIndex = this.products.findIndex(
      (findProduct) => findProduct.id === product.id,
    );

    if (findIndex >= 0) {
      this.products[findIndex] = product;
    } else {
      this.products.push(product);
    }

    return product as unknown as IProduct;
  }

  public async remove(product: Product): Promise<void> {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  public async findAll({
    page,
    skip,
    take,
  }: {
    page: number;
    skip: number;
    take: number;
  }): Promise<IProductPaginate> {
    const productsPaginated = this.products.slice(skip, skip + take);

    return {
      current_page: page,
      per_page: take,
      total: this.products.length,
      data: productsPaginated as unknown as IProduct[],
    };
  }

  public async findAllByIds(products: IFindProducts[]): Promise<IProduct[]> {
    const productIds = products.map((p) => p.id);

    const foundProducts = this.products.filter((product) =>
      productIds.includes(product.id),
    );

    return foundProducts as unknown as IProduct[];
  }

  public async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    products.forEach((productStockUpdate) => {
      const productIndex = this.products.findIndex(
        (p) => p.id === productStockUpdate.id,
      );

      if (productIndex !== -1) {
        this.products[productIndex].quantity = productStockUpdate.quantity;
      }
    });
  }
}
