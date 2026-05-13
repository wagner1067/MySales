import { Request, Response } from "express";
import SessionUserService from "@modules/users/services/SessionUserService";
import { container } from "tsyringe";

export default class SessionControllers {
  async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = container.resolve(SessionUserService);

    const userToken = await createSession.execute({
      email,
      password,
    });

    return res.json(userToken);
  }
}
