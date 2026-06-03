import AppError from "@shared/errors/AppError";
import { CreateProductService } from "./CreateProductService";
import FakeProductsRepository from "@modules/products/domain/repositories/fakes/FakeProductsRepositories";
import { makeProductData } from "@modules/products/domain/factories/productsFactory"; 

jest.mock("@shared/cache/RedisCache", () => {
  return jest.fn().mockImplementation(() => {
    return {
      invalidate: jest.fn(),
    };
  });
});

describe("CreateProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let createProduct: CreateProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProduct = new CreateProductService(fakeProductsRepository);
  });

  it("should be able to create a new product", async () => {
    const productData = makeProductData({
      name: "Produto Teste",
      price: 10.5,
      quantity: 10,
    });

    const product = await createProduct.execute(productData);

    expect(product).toHaveProperty("id");
    expect(product.name).toBe("Produto Teste");
    expect(product.price).toBe(10.5);
    expect(product.quantity).toBe(10);
  });

  it("should not be able to create two products with the same name", async () => {
    const productData = makeProductData({ name: "Produto Duplicado" });

    await createProduct.execute(productData);

    await expect(
      createProduct.execute(productData),
    ).rejects.toBeInstanceOf(AppError);
  });
});