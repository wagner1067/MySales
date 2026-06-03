import AppError from "@shared/errors/AppError";
import FakeOrdersRepository from "@modules/orders/domain/repositories/fakes/FakeOrdersRepositories";
import ShowOrderService from "./ShowOrderService";
import { makeOrderData } from "@modules/orders/domain/factories/ordersFactory";

describe("ShowOrderService", () => {
  let fakeOrdersRepository: FakeOrdersRepository;
  let showOrder: ShowOrderService;

  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    showOrder = new ShowOrderService(fakeOrdersRepository);
  });

  it("should be able to show an order by id", async () => {
    const orderData = makeOrderData();

    await fakeOrdersRepository.create({
      customer: orderData.customer,
      products: orderData.order_products as any,
    });

    const order = await showOrder.execute({ id: 1 });

    expect(order).toHaveProperty("id");
    expect(order.customer.name).toBe("Cliente Teste");
    expect(order.order_products[0].product_id).toBe("id-produto-1");
  });

  it("should not be able to show a non-existing order", async () => {
    await expect(
      showOrder.execute({
        id: 999,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});