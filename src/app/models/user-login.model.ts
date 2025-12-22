// ====================================================

// ====================================================

export class UserLogin {
  constructor();
  constructor(email?: string, password?: string, rememberMe?: boolean) {
    this.userName = email;
    this.password = password;
    this.rememberMe = rememberMe;
  }

  userName?: string;
  token?: string;
  email?: string;
  password?: string;
  role?: string;
  rememberMe?: boolean;
  code?: string;
  provider?: number;
}
