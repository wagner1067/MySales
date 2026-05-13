import { ICustomersRepository } from "@modules/customers/domain/repositories/ICustomersRepositories";
import CustomersRepository from "@modules/customers/infra/database/repositories/CustomerRepositories";
import { IOrdersRepositories } from "@modules/orders/domain/repositories/IOrdersRepositories";
import OrdersRepository from "@modules/orders/infra/database/repositories/OrderRepositories";
import { IProductsRepository } from "@modules/products/domain/repositories/IProductsRepository";
import ProductsRepository from "@modules/products/infra/database/repositories/ProductsRepositories";
import { IUsersRepository } from "@modules/users/domain/repositories/IUserRepositories";
import { IUserTokensRepository } from "@modules/users/domain/repositories/IUserTokensRepository";
import UsersRepository from "@modules/users/infra/database/repositories/UsersRepositories";
import UserTokensRepository from "@modules/users/infra/database/repositories/UserTokensRepositories";
import { container } from "tsyringe";

container.registerSingleton<ICustomersRepository>(
  "CustomersRepository",
  CustomersRepository,
);

container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  ProductsRepository,
);

container.registerSingleton<IOrdersRepositories>(
  "OrdersRepository",
  OrdersRepository,
);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  "UserTokensRepository",
  UserTokensRepository,
);
