import ResetPasswordService from "@modules/users/services/ResetPasswordService";
import { Request, Response } from "express";

export default class ForgotPasswordControllers {
  async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const resetPasswordService = new ResetPasswordService();

    await resetPasswordService.execute({ password, token });

    return response.status(204).json();
  }
}
