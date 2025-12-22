export class AppRegex {
  public static readonly PasswordRegex =
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{7,}';
  public static readonly IMEDeviceRegex = '([0-9]){15}';
}
