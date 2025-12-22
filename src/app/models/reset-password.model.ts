export class ResetPassword {
  constructor(newPassword?: string, confirmPassword?: string) {
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }
  newPassword?: string;
  confirmPassword?: string;
}
