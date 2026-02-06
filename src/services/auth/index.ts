import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ConfirmEmailRequest,
  ConfirmEmailResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types";

import { changePassword } from "./changePassword.service";
import { confirmEmail } from "./confirmEmail.service";
import { deleteUser } from "./deleteUser.service";
import { login } from "./login.service";
import { refresh } from "./refresh.service";
import { register } from "./register.service";

class AuthService {
  login!: (request: LoginRequest) => Promise<LoginResponse>;
  register!: (request: RegisterRequest) => Promise<RegisterResponse>;
  refresh!: (request: RefreshRequest) => Promise<RefreshResponse>;
  confirmEmail!: (request: ConfirmEmailRequest) => Promise<ConfirmEmailResponse>;
  deleteUser!: (request: DeleteUserRequest) => Promise<DeleteUserResponse>;
  changePassword!: (request: ChangePasswordRequest) => Promise<ChangePasswordResponse>;
}

AuthService.prototype.login = login;
AuthService.prototype.register = register;
AuthService.prototype.refresh = refresh;
AuthService.prototype.deleteUser = deleteUser;
AuthService.prototype.changePassword = changePassword;
AuthService.prototype.confirmEmail = confirmEmail;

export { AuthService };
