export class UserSettingKeys {
  static readonly ShippingCost = 'ShippingCost';
  static readonly Tax = 'Tax';
  static readonly TaxType = 'TaxType';

  static readonly All = [
    UserSettingKeys.Tax,
    UserSettingKeys.ShippingCost,
    UserSettingKeys.TaxType,
  ]
}
export class TaxTypeConstant
{
  static readonly Percent = 'Percent';
  static readonly Fixed = 'Fixed';
}
