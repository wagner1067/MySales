import { User } from "@modules/users/infra/database/entities/User";
import { IUser } from "../models/IUser";

export const userMock = {
  name: "John Doe",
  email: "L1U8o@example.com",
  password: "123456",
};

export const mockUserData: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    password: "hashed-password",
    created_at: new Date(),
    updated_at: new Date(),
    getAvatarUrl() {
      return "avatar.jpg";
    },
  } as User,
];

export const mockPaginatedUsers = {
  per_page: 10,
  total: 1,
  current_page: 1,
  data: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    } as unknown as IUser,
  ],
};

export const userTokenFake = {
  id: "token-id",
  token: "generated-token-123",
  user_id: "user-id-123",
  created_at: new Date(),
};

export const userFake = {
  id: "user-id-123",
  name: "John Doe",
  email: "john@example.com",
} as unknown as IUser;

export const userWithAvatarFake = {
  id: 1,
  name: "John Doe",
  avatar: "old_avatar.jpg",
} as unknown as User;
