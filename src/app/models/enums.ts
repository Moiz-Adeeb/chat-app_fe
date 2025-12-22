// ====================================================

// ====================================================
export enum CompanyType {
  BillPayment = 1,
  AirTopUp,
}
export enum CallStates {
  None,
  Ringing,
  Joining,
  Joined,
  Connected,
  Stopped,
  Exited,
}
export enum EmployeeType {
  Vendor = 1,
  Supervisor = 2,
  Cashier = 3,
}

export class ResponseType {
  public static SUCESS = 'Success';
  public static BAD = 'Bad Request';
  public static ERROR = 'Error';
}

export enum RequestStatus {
  None = 0,
  Accepted,
  Rejected,
}

export enum Severity {
  Low = 1,
  Medium,
  High,
}

export enum WithdrawRequestType {
  MPesa = 1,
  Bank,
}

export enum CardType {
  Visa = 1,
  MasterCard,
  AmericanExpress,
  Jcb,
  Discover,
  Diners,
}

// ====================================================

// ====================================================
export enum CashInRequestType {
  /// <summary>
  /// Deposit money in Bank Account
  /// </summary>
  Bank = 1,
  /// <summary>
  /// Deposit Money via Wari Account
  /// </summary>
  Wari,
  /// <summary>
  /// Deposit Money via Orange account
  /// </summary>
  Orange,
  /// <summary>
  /// Deposit Money via Orange account
  /// </summary>
  Stripe,
}

export enum LoadType {
  /// <summary>
  /// Send Money
  /// </summary>
  SendMoney = 1,
  /// <summary>
  /// By Debit Card
  /// </summary>
  DebitCard,
  /// <summary>
  /// Requested Money
  /// </summary>
  Sender,
  /// <summary>
  /// Vendor Payment
  /// </summary>
  Vendor,
  /// <summary>
  /// Bill Payment
  /// </summary>
  Bill,
  /// <summary>
  /// Withdraw Request
  /// </summary>
  Withdraw,
  /// <summary>
  /// Bill Rejected By Admin
  /// </summary>
  BillRejected,
  /// <summary>
  /// Withdraw Rejected By Admin
  /// </summary>
  WithdrawRequestRejected,
  /// <summary>
  /// Air Time Top Up Rejected By Admin
  /// </summary>
  AirTimeTopUpRequestRejected,
  /// <summary>
  /// Cash In Requests (Merchant Top Up)
  /// </summary>
  CashInRequest,
  /// <summary>
  /// Cash In By Customer
  /// </summary>
  CashIn,
  /// <summary>
  /// Cash out done by Vendor or Cashier for the Customer
  /// </summary>
  CashOut,
  /// <summary>
  /// Air Time Top Up Rejected By Admin
  /// </summary>
  AirTimeTopUpRequest,
  /// <summary>
  /// Transfer Money in Employee
  /// </summary>
  TransferMoney,
  /// <summary>
  /// Scan To Pay via QrCode
  /// </summary>
  ScanToPay,
  /// <summary>
  /// Purchase Item
  /// </summary>
  PurchaseItem,
}
