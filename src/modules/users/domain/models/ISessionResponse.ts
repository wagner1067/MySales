import { User } from "@modules/users/infra/database/entities/User";

export interface ISessionResponse {
  user: User;
  token: string;
}
