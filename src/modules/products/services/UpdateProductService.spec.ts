import AppError from "@shared/errors/AppError";
import FakeProductsRepository from "@modules/products/domain/repositories/fakes/FakeProductsRepositories";
import UpdateProductService from "./UpdateProductService";
import { makeProductData } from "@modules/products/domain/factories/productsFactory";

jest.mock("@shared/cache/RedisCache", () => {
  return jest.fn().mockImplementation(() => {
    return {
      invalidate: jest.fn(),
    };
  });
});

describe("UpdateProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let updateProduct: UpdateProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    updateProduct = new UpdateProductService(fakeProductsRepository);
  });

  it("should be able to update a product", async () => {
    const product = await fakeProductsRepository.create(
      makeProductData({ name: "Nome Antigo", price: 10, quantity: 5 })
    );

    const updatedProduct = await updateProduct.execute({
      id: product.id,
      name: "Nome Novo",
      price: 15.5,
      quantity: 20,
    });

    expect(updatedProduct.name).toBe("Nome Novo");
    expect(updatedProduct.price).toBe(15.5);
    expect(updatedProduct.quantity).toBe(20);
  });

  it("should not be able to update a non-existing product", async () => {
    await expect(
      updateProduct.execute({
        id: "id-nao-existe",
        name: "Qualquer Nome",
        price: 10,
        quantity: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update a product name to an already existing product name", async () => {
    await fakeProductsRepository.create(
      makeProductData({ name: "Produto A" })
    );

    const productB = await fakeProductsRepository.create(
      makeProductData({ name: "Produto B" })
    );

    await expect(
      updateProduct.execute({
        id: productB.id,
        name: "Produto A", 
        price: 50,
        quantity: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update a product keeping its own name", async () => {
    const product = await fakeProductsRepository.create(
      makeProductData({ name: "Mesmo Nome", price: 10 })
    );

    const updatedProduct = await updateProduct.execute({
      id: product.id,
      name: "Mesmo Nome", 
      price: 25.0, 
      quantity: 5,
    });

    expect(updatedProduct.price).toBe(25.0);
    expect(updatedProduct.name).toBe("Mesmo Nome");
  });
});