import { Request, Response } from "express";
import SessionUserService from "../services/SessionUserService";

export default class SessionControllers {
  async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = new SessionUserService();

    const userToken = await createSession.execute({
      email,
      password,
    });

    return res.json(userToken);
  }
}
