import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class RoleNames {
  public static readonly Guest = 'Guest';

  public static readonly Administrator = "Administrator";

  // Admin Staff (Staff working under Administrator)
  public static readonly AdminStaff = "AdminStaff";

  // Company Admin Roles
  public static readonly CompanyAdmin = "CompanyAdmin";

  // Employee Roles
  public static readonly Employee = "Employee";

  public static readonly AllRoles: string[] = [
    RoleNames.Administrator,
    RoleNames.AdminStaff,
    RoleNames.CompanyAdmin,
    RoleNames.Employee,
  ];
}
export class Permissions {

  // ========================================
  // Admin Module Permissions
  // ========================================

  // Subscription Plans Management
  public static readonly ViewSubscriptionPlans = 'Permissions.SubscriptionPlans.View';
  public static readonly CreateSubscriptionPlans = 'Permissions.SubscriptionPlans.Create';
  public static readonly UpdateSubscriptionPlans = 'Permissions.SubscriptionPlans.Update';
  public static readonly DeleteSubscriptionPlans = 'Permissions.SubscriptionPlans.Delete';
  public static readonly AssignSubscription = 'Permissions.AdminRoles.AssignSubscription';
  public static readonly UpdateCompanySubscription = 'Permission.AdminRoles.UpdateCompanySubscription';

  // Company Management
  public static readonly ViewCompanies = 'Permissions.Companies.View';
  public static readonly CreateCompanies = 'Permissions.Companies.Create';
  public static readonly UpdateCompanies = 'Permissions.Companies.Update';
  public static readonly DeleteCompanies = 'Permissions.Companies.Delete';
  public static readonly ApproveCompanies = 'Permissions.Companies.Approve';
  public static readonly RejectCompanies = 'Permissions.Companies.Reject';
  public static readonly AssignCompanySubscriptionPlan = 'Permissions.Companies.AssignSubscriptionPlan';
  public static readonly ViewCompanyDocuments = 'Permissions.Companies.ViewDocuments';

  // Company Subscription Requests Management
  public static readonly ViewCompanySubscriptionRequests = 'Permissions.CompanySubscriptionRequests.View';
  public static readonly ApproveCompanySubscriptionRequests = 'Permissions.CompanySubscriptionRequests.Approve';
  public static readonly RejectCompanySubscriptionRequests = 'Permissions.CompanySubscriptionRequests.Reject';

  // Payments Management
  public static readonly ViewPayments = 'Permissions.Payments.View';
  public static readonly VerifyPayments = 'Permissions.Payments.Verify';
  public static readonly RejectPayments = 'Permissions.Payments.Reject';

  // Admin Dashboard
  public static readonly ViewAdminDashboard = 'Permissions.AdminDashboard.View';

  // Admin Staff Management
  public static readonly ViewAdminStaff = 'Permissions.AdminStaff.View';
  public static readonly CreateAdminStaff = 'Permissions.AdminStaff.Create';
  public static readonly UpdateAdminStaff = 'Permissions.AdminStaff.Update';
  public static readonly DeleteAdminStaff = 'Permissions.AdminStaff.Delete';
  public static readonly ActivateAdminStaff = 'Permissions.AdminStaff.Activate';
  public static readonly DeactivateAdminStaff = 'Permissions.AdminStaff.Deactivate';

  // Admin Roles & Permissions
  public static readonly ViewAdminRoles = 'Permissions.AdminRoles.View';
  public static readonly CreateAdminRoles = 'Permissions.AdminRoles.Create';
  public static readonly UpdateAdminRoles = 'Permissions.AdminRoles.Update';
  public static readonly DeleteAdminRoles = 'Permissions.AdminRoles.Delete';
  public static readonly AssignAdminRolePermissions = 'Permissions.AdminRoles.AssignPermissions';

  // Global App Settings
  public static readonly ViewGlobalSettings = 'Permissions.GlobalSettings.View';
  public static readonly UpdateGlobalSettings = 'Permissions.GlobalSettings.Update';

  // ========================================
  // Company Module Permissions
  // ========================================

  // Company Roles & Permissions
  public static readonly ViewCompanyRoles = 'Permissions.CompanyRoles.View';
  public static readonly CreateCompanyRoles = 'Permissions.CompanyRoles.Create';
  public static readonly UpdateCompanyRoles = 'Permissions.CompanyRoles.Update';
  public static readonly DeleteCompanyRoles = 'Permissions.CompanyRoles.Delete';
  public static readonly AssignCompanyRolePermissions = 'Permissions.CompanyRoles.AssignPermissions';

  // Branch Management
  public static readonly ViewBranches = 'Permissions.Branches.View';
  public static readonly CreateBranches = 'Permissions.Branches.Create';
  public static readonly UpdateBranches = 'Permissions.Branches.Update';
  public static readonly DeleteBranches = 'Permissions.Branches.Delete';
  public static readonly ActivateBranches = 'Permissions.Branches.Activate';
  public static readonly DeactivateBranches = 'Permissions.Branches.Deactivate';

  // Company Staff Management
  public static readonly ViewCompanyStaff = 'Permissions.CompanyStaff.View';
  public static readonly CreateCompanyStaff = 'Permissions.CompanyStaff.Create';
  public static readonly UpdateCompanyStaff = 'Permissions.CompanyStaff.Update';
  public static readonly DeleteCompanyStaff = 'Permissions.CompanyStaff.Delete';
  public static readonly ActivateCompanyStaff = 'Permissions.CompanyStaff.Activate';
  public static readonly DeactivateCompanyStaff = 'Permissions.CompanyStaff.Deactivate';
  public static readonly ViewCompanyStaffDocuments = 'Permissions.CompanyStaff.ViewDocuments';

  // Loan Offers Management
  public static readonly ViewLoanOffers = 'Permissions.LoanOffers.View';
  public static readonly CreateLoanOffers = 'Permissions.LoanOffers.Create';
  public static readonly UpdateLoanOffers = 'Permissions.LoanOffers.Update';
  public static readonly DeleteLoanOffers = 'Permissions.LoanOffers.Delete';
  public static readonly ActivateLoanOffers = 'Permissions.LoanOffers.Activate';
  public static readonly DeactivateLoanOffers = 'Permissions.LoanOffers.Deactivate';

  // Payroll Generation
  public static readonly ViewPayroll = 'Permissions.Payroll.View';
  public static readonly CreatePayroll = 'Permissions.Payroll.Create';
  public static readonly DeletePayroll = 'Permissions.Payroll.Delete';
  public static readonly GeneratePayroll = 'Permissions.Payroll.Generate';
  public static readonly ApprovePayroll = 'Permissions.Payroll.Approve';
  public static readonly RejectPayroll = 'Permissions.Payroll.Reject';
  public static readonly UploadPayrollProof = 'Permissions.Payroll.UploadProof';

  // Loan Requests Management
  public static readonly ViewLoanRequests = 'Permissions.LoanRequests.View';
  public static readonly CreateLoanRequests = 'Permissions.LoanRequests.Create';
  public static readonly UpdateLoanRequests = 'Permissions.LoanRequests.Update';
  public static readonly DeleteLoanRequests = 'Permissions.LoanRequests.Delete';
  public static readonly ApproveLoanRequests = 'Permissions.LoanRequests.Approve';
  public static readonly RejectLoanRequests = 'Permissions.LoanRequests.Reject';
  public static readonly ViewLoanRequestDocuments = 'Permissions.LoanRequests.ViewDocuments';

  // Loan Dashboard & Reports
  public static readonly ViewLoanHistory = 'Permissions.Loans.ViewHistory';
  public static readonly ViewLoanBalance = 'Permissions.Loans.ViewBalance';
  public static readonly ViewPaymentHistory = 'Permissions.Loans.ViewPaymentHistory';
  public static readonly ViewPaymentStatus = 'Permissions.Loans.ViewPaymentStatus';
  public static readonly ViewActiveLoansByBranch = 'Permissions.Loans.ViewActiveLoansByBranch';

  // Company Admin Dashboard
  public static readonly ViewCompanyAdminDashboard = 'Permissions.CompanyAdminDashboard.View';

  // Company App Settings
  public static readonly ViewCompanySettings = 'Permissions.CompanySettings.View';
  public static readonly UpdateCompanySettings = 'Permissions.CompanySettings.Update';

  // Company Reports
  public static readonly ViewCompanyReports = 'Permissions.Employee.ViewCompanyReports';
  public static readonly ExportCompanyReports = 'Permissions.Employee.ExportCompanyReports';

  // ========================================
  // Employee Module Permissions
  // ========================================

  // Employee Dashboard
  public static readonly ViewEmployeeDashboard = 'Permissions.Employee.ViewDashboard';
  public static readonly ViewOwnPendingLoans = 'Permissions.Employee.ViewOwnPendingLoans';
  public static readonly ViewOwnActiveLoans = 'Permissions.Employee.ViewOwnActiveLoans';
  public static readonly ViewOwnLoanHistory = 'Permissions.Employee.ViewOwnLoanHistory';

  // Loan Request - Standard Offers
  public static readonly ViewAvailableOffers = 'Permissions.Employee.ViewAvailableOffers';
  public static readonly ApplyForStandardLoan = 'Permissions.Employee.ApplyForStandardLoan';

  // Custom Loan Request
  public static readonly CreateCustomLoanRequest = 'Permissions.Employee.CreateCustomLoanRequest';
  public static readonly UploadLoanDocuments = 'Permissions.Employee.UploadLoanDocuments';

  // Advance Salary Request
  public static readonly RequestAdvanceSalary = 'Permissions.Employee.RequestAdvanceSalary';

  // Pay Off / Loan Repayment
  public static readonly ViewPaymentSchedule = 'Permissions.Employee.ViewPaymentSchedule';
  public static readonly MakeLoanPayment = 'Permissions.Employee.MakeLoanPayment';
  public static readonly ViewRemainingBalance = 'Permissions.Employee.ViewRemainingBalance';

  // Employee Profile
  public static readonly ViewOwnProfile = 'Permissions.Employee.ViewOwnProfile';
  public static readonly UpdateOwnProfile = 'Permissions.Employee.UpdateOwnProfile';

  // ========================================
  // System Permissions
  // ========================================

  // Audit & Logging
  public static readonly ViewAuditLogs = 'Permissions.System.ViewAuditLogs';
  public static readonly ExportReports = 'Permissions.System.ExportReports';

  // Notifications
  public static readonly SendNotifications = 'Permissions.System.SendNotifications';
  public static readonly ViewNotifications = 'Permissions.System.ViewNotifications';

  // ========================================
  // Permission Arrays for Easy Assignment
  // ========================================

  // All Admin Permissions
  public static readonly AllAdminPermissions: string[] = [
    // Admin Dashboard
    Permissions.ViewAdminDashboard,
    // Subscription Plans
    Permissions.ViewSubscriptionPlans,
    Permissions.CreateSubscriptionPlans,
    Permissions.UpdateSubscriptionPlans,
    Permissions.DeleteSubscriptionPlans,
    Permissions.AssignSubscription,
    Permissions.UpdateCompanySubscription,
    // Companies
    Permissions.ViewCompanies,
    Permissions.CreateCompanies,
    Permissions.UpdateCompanies,
    Permissions.DeleteCompanies,
    Permissions.ApproveCompanies,
    Permissions.RejectCompanies,
    Permissions.AssignCompanySubscriptionPlan,
    Permissions.ViewCompanyDocuments,
    // Company Subscription Requests
    Permissions.ViewCompanySubscriptionRequests,
    Permissions.ApproveCompanySubscriptionRequests,
    Permissions.RejectCompanySubscriptionRequests,
    // Payments
    Permissions.ViewPayments,
    Permissions.VerifyPayments,
    Permissions.RejectPayments,
    // Admin Staff
    Permissions.ViewAdminStaff,
    Permissions.CreateAdminStaff,
    Permissions.UpdateAdminStaff,
    Permissions.DeleteAdminStaff,
    Permissions.ActivateAdminStaff,
    Permissions.DeactivateAdminStaff,
    // Admin Roles
    Permissions.ViewAdminRoles,
    Permissions.CreateAdminRoles,
    Permissions.UpdateAdminRoles,
    Permissions.DeleteAdminRoles,
    Permissions.AssignAdminRolePermissions,
    // Global Settings
    Permissions.ViewGlobalSettings,
    Permissions.UpdateGlobalSettings,
    // System
    Permissions.ViewAuditLogs,
    Permissions.ExportReports,
    Permissions.SendNotifications,
    Permissions.ViewNotifications,
  ];

  // All Company Admin Permissions
  public static readonly AllCompanyAdminPermissions: string[] = [
    // Company Admin Dashboard
    Permissions.ViewCompanyAdminDashboard,
    // Company Roles
    Permissions.ViewCompanyRoles,
    Permissions.CreateCompanyRoles,
    Permissions.UpdateCompanyRoles,
    Permissions.DeleteCompanyRoles,
    Permissions.AssignCompanyRolePermissions,
    // Branches
    Permissions.ViewBranches,
    Permissions.CreateBranches,
    Permissions.UpdateBranches,
    Permissions.DeleteBranches,
    Permissions.ActivateBranches,
    Permissions.DeactivateBranches,
    // Company Staff
    Permissions.ViewCompanyStaff,
    Permissions.CreateCompanyStaff,
    Permissions.UpdateCompanyStaff,
    Permissions.DeleteCompanyStaff,
    Permissions.ActivateCompanyStaff,
    Permissions.DeactivateCompanyStaff,
    Permissions.ViewCompanyStaffDocuments,
    // Loan Offers
    Permissions.ViewLoanOffers,
    Permissions.CreateLoanOffers,
    Permissions.UpdateLoanOffers,
    Permissions.DeleteLoanOffers,
    Permissions.ActivateLoanOffers,
    Permissions.DeactivateLoanOffers,
    // Payroll
    Permissions.ViewPayroll,
    Permissions.CreatePayroll,
    Permissions.DeletePayroll,
    Permissions.GeneratePayroll,
    Permissions.ApprovePayroll,
    Permissions.RejectPayroll,
    Permissions.UploadPayrollProof,
    // Loan Requests
    Permissions.ViewLoanRequests,
    Permissions.CreateLoanRequests,
    Permissions.UpdateLoanRequests,
    Permissions.DeleteLoanRequests,
    Permissions.ApproveLoanRequests,
    Permissions.RejectLoanRequests,
    Permissions.ViewLoanRequestDocuments,
    // Loan Dashboard
    Permissions.ViewLoanHistory,
    Permissions.ViewLoanBalance,
    Permissions.ViewPaymentHistory,
    Permissions.ViewPaymentStatus,
    Permissions.ViewActiveLoansByBranch,
    // Company Settings
    Permissions.ViewCompanySettings,
    Permissions.UpdateCompanySettings,
    // Reports
    Permissions.ViewCompanyReports,
    Permissions.ExportCompanyReports,
    // Notifications
    Permissions.ViewNotifications,
    Permissions.SendNotifications,
  ];

  // All Employee Permissions
  public static readonly AllEmployeePermissions: string[] = [
    // Dashboard
    Permissions.ViewEmployeeDashboard,
    Permissions.ViewOwnPendingLoans,
    Permissions.ViewOwnActiveLoans,
    Permissions.ViewOwnLoanHistory,
    // Loan Applications
    Permissions.ViewAvailableOffers,
    Permissions.ApplyForStandardLoan,
    Permissions.CreateCustomLoanRequest,
    Permissions.UploadLoanDocuments,
    // Advance Salary
    Permissions.RequestAdvanceSalary,
    // Payments
    Permissions.ViewPaymentSchedule,
    Permissions.MakeLoanPayment,
    Permissions.ViewRemainingBalance,
    // Profile
    Permissions.ViewOwnProfile,
    Permissions.UpdateOwnProfile,
    // Notifications
    Permissions.ViewNotifications,
  ];

  // All Permissions Combined
  public static readonly AllPermissions: string[] = [
    // Admin Module
    ...Permissions.AllAdminPermissions,
    // Company Module
    ...Permissions.AllCompanyAdminPermissions,
    // Employee Module
    ...Permissions.AllEmployeePermissions,
  ];
}

@Injectable({
  providedIn: 'root',
})
export class HelperFunction {
  constructor(private translate: TranslateService) {}

  getNotificationTypeLabel(type: number): string {
    switch (type) {
      case 0:
        return this.translate.instant('General');
      case 1:
        return this.translate.instant('LoanApproval');
      case 2:
        return this.translate.instant('LoanRejection');
      case 3:
        return this.translate.instant('PaymentDue');
      case 4:
        return this.translate.instant('PaymentReceived');
      case 5:
        return this.translate.instant('SubscriptionUpdate');
      case 6:
        return this.translate.instant('SystemAlert');
      default:
        return this.translate.instant('Notification');
    }
  }
}
