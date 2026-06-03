import FakeProductsRepository from "@modules/products/domain/repositories/fakes/FakeProductsRepositories";
import ListProductService from "./ListProductService";
import { makeProductData, makeProductPaginate } from "@modules/products/domain/factories/productsFactory"; // Importando as duas funções da factory

let mockRedisRecover = jest.fn();
let mockRedisSave = jest.fn();

jest.mock("@shared/cache/RedisCache", () => {
  return jest.fn().mockImplementation(() => {
    return {
      recover: mockRedisRecover,
      save: mockRedisSave,
    };
  });
});

describe("ListProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let listProduct: ListProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    listProduct = new ListProductService(fakeProductsRepository);

    mockRedisRecover.mockReset();
    mockRedisSave.mockReset();
  });

  it("should be able to list products from repository when cache is empty", async () => {
    mockRedisRecover.mockResolvedValue(null);

    await fakeProductsRepository.create(makeProductData({ name: "Produto 1" }));
    await fakeProductsRepository.create(makeProductData({ name: "Produto 2" }));

    const response = await listProduct.execute({
      page: 1,
      skip: 0,
      take: 10,
    });

    expect(response.total).toBe(2);
    expect(response.data).toHaveLength(2);
    expect(response.data[0].name).toBe("Produto 1");

    expect(mockRedisSave).toHaveBeenCalledWith(
      "api-vendas-PRODUCT_LIST",
      expect.any(String)
    );
  });

  it("should be able to list products directly from cache if available", async () => {
    const mockCachedData = makeProductPaginate();
    
    mockRedisRecover.mockResolvedValue(mockCachedData);

    const response = await listProduct.execute({
      page: 1,
      skip: 0,
      take: 10,
    });

    expect(response.data[0].name).toBe("Produto vindo do Cache");
    expect(response.total).toBe(1);
    expect(mockRedisSave).not.toHaveBeenCalled();
  });
});