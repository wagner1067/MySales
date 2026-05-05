export interface IUpdateProfile {
  user_id: number;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}
