import AppError from "@shared/errors/AppError";
import FakeProductsRepository from "@modules/products/domain/repositories/fakes/FakeProductsRepositories";
import ShowProductService from "./ShowProductService";
import { makeProductData } from "@modules/products/domain/factories/productsFactory"; 

describe("ShowProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let showProduct: ShowProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    showProduct = new ShowProductService(fakeProductsRepository);
  });

  it("should be able to show a product by id", async () => {
    const newProduct = await fakeProductsRepository.create(
      makeProductData({
        name: "Teclado Mecânico",
        price: 299.90,
      })
    );

    const product = await showProduct.execute({ id: newProduct.id });

    expect(product).toHaveProperty("id");
    expect(product.id).toBe(newProduct.id);
    expect(product.name).toBe("Teclado Mecânico");
    expect(product.price).toBe(299.90);
  });

  it("should not be able to show a non-existing product", async () => {
    await expect(
      showProduct.execute({
        id: "id-inexistente",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});