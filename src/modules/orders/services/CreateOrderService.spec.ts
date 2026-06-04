import AppError from "@shared/errors/AppError";
import CreateOrderService from "@modules/orders/services/CreateOrderService";
import FakeProductsRepository from "@modules/products/domain/repositories/fakes/FakeProductsRepositories";
import { makeCustomerData } from "@modules/customers/domain/factories/customerFactory";
import { makeProductData } from "@modules/products/domain/factories/productsFactory";
import FakeOrdersRepository from "../domain/repositories/fakes/FakeOrdersRepositories";
import FakeCustomersRepository from "@modules/customers/domain/repositories/fakes/FakeCustomerRepositories";

describe("CreateOrderService", () => {
  let fakeOrdersRepository: FakeOrdersRepository;
  let fakeCustomersRepository: FakeCustomersRepository;
  let fakeProductsRepository: FakeProductsRepository;
  let createOrder: CreateOrderService;

  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeProductsRepository = new FakeProductsRepository();

    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeCustomersRepository,
      fakeProductsRepository,
    );
  });

  it("should be able to create a new order", async () => {
    const customer = await fakeCustomersRepository.create(makeCustomerData());

    const product = await fakeProductsRepository.create(
      makeProductData({ price: 100.0, quantity: 10 }),
    );

    const order = await createOrder.execute({
      customer_id: String(customer.id),
      products: [
        {
          id: product.id,
          quantity: 2,
        },
      ],
    });

    expect(order).toHaveProperty("id");
    expect(order.customer.id).toBe(customer.id);
    expect(order.order_products[0].product_id).toBe(product.id);
    expect(order.order_products[0].quantity).toBe(2);

    const updatedProduct = await fakeProductsRepository.findById(product.id);
    expect(updatedProduct?.quantity).toBe(8);
  });

  it("should not be able to create an order with a non-existing customer", async () => {
    await expect(
      createOrder.execute({
        customer_id: "999",
        products: [{ id: "id-qualquer", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an order with a non-existing product", async () => {
    const customer = await fakeCustomersRepository.create(makeCustomerData());

    await expect(
      createOrder.execute({
        customer_id: String(customer.id),
        products: [{ id: "produto-fantasma", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an order if stock quantity is insufficient", async () => {
    const customer = await fakeCustomersRepository.create(makeCustomerData());

    const product = await fakeProductsRepository.create(
      makeProductData({ quantity: 3 }),
    );

    await expect(
      createOrder.execute({
        customer_id: String(customer.id),
        products: [
          {
            id: product.id,
            quantity: 5,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should not be able to create an order if any of the products do not exist", async () => {
    const customer = await fakeCustomersRepository.create(makeCustomerData());

    const realProduct = await fakeProductsRepository.create(
      makeProductData({ price: 50.0, quantity: 10 }),
    );

    await expect(
      createOrder.execute({
        customer_id: String(customer.id),
        products: [
          {
            id: realProduct.id,
            quantity: 2,
          },
          {
            id: "produto-fantasma-id-999",
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should use serialized products when order_products is not returned by the repository", async () => {
    const customer = await fakeCustomersRepository.create(makeCustomerData());

    const product = await fakeProductsRepository.create(
      makeProductData({ price: 100.0, quantity: 10 }),
    );

    jest.spyOn(fakeOrdersRepository, "create").mockResolvedValueOnce({
      id: "any-order-id",
      customer,
    } as any);

    const order = await createOrder.execute({
      customer_id: String(customer.id),
      products: [
        {
          id: product.id,
          quantity: 2,
        },
      ],
    });

    const updatedProduct = await fakeProductsRepository.findById(product.id);
    expect(updatedProduct?.quantity).toBe(8);
  });
});
