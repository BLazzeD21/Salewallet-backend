import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ConfirmEmailRequest,
  DeleteUserRequest,
  DeleteUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Tokens,
} from "@/types";

import { changePassword } from "./changePassword.service";
import { deleteUser } from "./deleteUser.service";
import { login } from "./login.service";
import { refresh } from "./refresh.service";
import { register } from "./register.service";

class AuthService {
  login!: (request: LoginRequest) => Promise<LoginResponse>;
  register!: (request: RegisterRequest) => Promise<RegisterResponse>;
  refresh!: (authorization?: string) => Promise<Tokens>;
  confirmEmail!: (request: ConfirmEmailRequest) => Promise<string>;
  deleteUser!: (request: DeleteUserRequest) => Promise<DeleteUserResponse>;
  changePassword!: (request: ChangePasswordRequest) => Promise<ChangePasswordResponse>;
}

AuthService.prototype.login = login;
AuthService.prototype.register = register;
AuthService.prototype.refresh = refresh;
AuthService.prototype.deleteUser = deleteUser;
AuthService.prototype.changePassword = changePassword;

export { AuthService };
