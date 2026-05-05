import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService";
import { Request, Response } from "express";

export default class ForgotPasswordControllers {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService();

    await sendForgotPasswordEmailService.execute({ email });

    return response.status(204).json();
  }
}
