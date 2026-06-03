import AppError from "@shared/errors/AppError";
import FakeProductsRepository from "@modules/products/domain/repositories/fakes/FakeProductsRepositories";
import DeleteProductService from "./DeleteProductService";
import { makeProductData } from "@modules/products/domain/factories/productsFactory"; // Certifique-se de ajustar o caminho correto do import

jest.mock("@shared/cache/RedisCache", () => {
  return jest.fn().mockImplementation(() => {
    return {
      invalidate: jest.fn(),
    };
  });
});

describe("DeleteProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let deleteProduct: DeleteProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    deleteProduct = new DeleteProductService(fakeProductsRepository);
  });

  it("should be able to delete a product", async () => {
  
    const product = await fakeProductsRepository.create(
      makeProductData({ name: "Produto para Deletar" }) 
    );

    await deleteProduct.execute({ id: product.id });

    const findProduct = await fakeProductsRepository.findById(product.id);

    expect(findProduct).toBeNull();
  });

  it("should not be able to delete a non-existing product", async () => {
    await expect(
      deleteProduct.execute({
        id: "id-que-nao-existe",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});