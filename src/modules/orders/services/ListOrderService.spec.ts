import FakeOrdersRepository from "@modules/orders/domain/repositories/fakes/FakeOrdersRepositories";
import ListOrderService from "./ListOrderService";
import { makeOrderData } from "@modules/orders/domain/factories/ordersFactory";

describe("ListOrderService", () => {
  let fakeOrdersRepository: FakeOrdersRepository;
  let listOrder: ListOrderService;

  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    listOrder = new ListOrderService(fakeOrdersRepository);
  });

  it("should be able to list orders with pagination", async () => {
    const order1 = makeOrderData({ id: "1" });
    const order2 = makeOrderData({ id: "2" });

    await fakeOrdersRepository.create({
      customer: order1.customer,
      products: order1.order_products as any,
    });

    await fakeOrdersRepository.create({
      customer: order2.customer,
      products: order2.order_products as any,
    });

    const response = await listOrder.execute({
      page: 1,
      limit: 10,
    });

    expect(response).toHaveProperty("data");
    expect(response).toHaveProperty("total");
    expect(response.total).toBe(2);
    expect(response.data).toHaveLength(2);
    expect(response.current_page).toBe(1);
    expect(response.per_page).toBe(10);
  });

  it("should calculate correctly skip and take for pagination", async () => {
    const order1 = makeOrderData({ id: "1" });
    const order2 = makeOrderData({ id: "2" });
    const order3 = makeOrderData({ id: "3" });

    await fakeOrdersRepository.create({ customer: order1.customer, products: order1.order_products as any });
    await fakeOrdersRepository.create({ customer: order2.customer, products: order2.order_products as any });
    await fakeOrdersRepository.create({ customer: order3.customer, products: order3.order_products as any });

    const response = await listOrder.execute({
      page: 2,
      limit: 2,
    });

    expect(response.data).toHaveLength(1);
    expect(response.data[0].id).toBe(3); 
    expect(response.total).toBe(3); 
  });
});