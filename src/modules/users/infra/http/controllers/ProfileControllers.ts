import ShowProfileService from "@modules/users/services/ShowProfileService";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";
import { Request, Response } from "express";

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showProfile = new ShowProfileService();
    const user_id = Number(request.user.id);
    const user = await showProfile.execute({ user_id });
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, old_password, password } = request.body;
    const updateProfile = new UpdateProfileService();
    const user_id = Number(request.user.id);
    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });
    return response.json(user);
  }
}
