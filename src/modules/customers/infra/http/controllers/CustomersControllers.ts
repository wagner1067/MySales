import CreateCustomerService from "@modules/customers/services/CreateCustomerService";
import DeleteCustomerService from "@modules/customers/services/DeleteCustomerService";
import ListCustomerService from "@modules/customers/services/ListCustomerService";
import ShowCustomerService from "@modules/customers/services/ShowCustomerService";
import UpdateCustomerService from "@modules/customers/services/UpdateCustomerService";
import { Request, Response } from "express";

export default class CustomersControllers {
  async index(request: Request, response: Response): Promise<Response> {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;
    const listCustomers = new ListCustomerService();
    const customers = await listCustomers.execute(page, limit);
    return response.json(customers);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const id = Number(request.params.id);
    const showCustomer = new ShowCustomerService();
    const customer = await showCustomer.execute({ id });
    return response.json(customer);
  }

  async Create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const createCustomer = new CreateCustomerService();
    const customer = await createCustomer.execute({ name, email });
    return response.json(customer);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const id = Number(request.params.id);
    const { name, email } = request.body;
    const updateCustomer = new UpdateCustomerService();
    const customer = await updateCustomer.execute({ id, name, email });
    return response.json(customer);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const id = Number(request.params.id);
    const deleteCustomer = new DeleteCustomerService();
    await deleteCustomer.execute({ id });
    return response.status(204).json();
  }
}
