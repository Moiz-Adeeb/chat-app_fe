import { Permissions } from './role-names';

/**
 * Permission category structure
 */
export interface PermissionCategory {
  name: string;
  permissions: {
    value: string;
    label: string;
  }[];
}

/**
 * Admin Permission Categories
 * Organized by functional area for Admin roles
 */
export const adminPermissionCategories: PermissionCategory[] = [
  {
    name: 'SubscriptionPlansManagement',
    permissions: [
      { value: Permissions.ViewSubscriptionPlans, label: 'ViewSubscriptionPlans' },
      { value: Permissions.CreateSubscriptionPlans, label: 'CreateSubscriptionPlans' },
      { value: Permissions.UpdateSubscriptionPlans, label: 'UpdateSubscriptionPlans' },
      { value: Permissions.DeleteSubscriptionPlans, label: 'DeleteSubscriptionPlans' },
      { value: Permissions.AssignSubscription, label: 'AssignSubscription' },
      { value: Permissions.UpdateCompanySubscription, label: 'UpdateCompanySubscription' }
    ]
  },
  {
    name: 'CompanyManagement',
    permissions: [
      { value: Permissions.ViewCompanies, label: 'ViewCompanies' },
      { value: Permissions.CreateCompanies, label: 'CreateCompanies' },
      { value: Permissions.UpdateCompanies, label: 'UpdateCompanies' },
      { value: Permissions.DeleteCompanies, label: 'DeleteCompanies' },
      { value: Permissions.ApproveCompanies, label: 'ApproveCompanies' },
      { value: Permissions.RejectCompanies, label: 'RejectCompanies' },
      { value: Permissions.AssignCompanySubscriptionPlan, label: 'AssignSubscriptionPlan' },
      { value: Permissions.ViewCompanyDocuments, label: 'ViewCompanyDocuments' }
    ]
  },
  {
    name: 'CompanySubscriptionRequests',
    permissions: [
      { value: Permissions.ViewCompanySubscriptionRequests, label: 'ViewCompanySubscriptionRequests' },
      { value: Permissions.ApproveCompanySubscriptionRequests, label: 'ApproveCompanySubscriptionRequests' },
      { value: Permissions.RejectCompanySubscriptionRequests, label: 'RejectCompanySubscriptionRequests' }
    ]
  },
  {
    name: 'PaymentsManagement',
    permissions: [
      { value: Permissions.ViewPayments, label: 'ViewPayments' },
      { value: Permissions.VerifyPayments, label: 'VerifyPayments' },
      { value: Permissions.RejectPayments, label: 'RejectPayments' }
    ]
  },
  {
    name: 'AdminStaffManagement',
    permissions: [
      { value: Permissions.ViewAdminStaff, label: 'ViewAdminStaff' },
      { value: Permissions.CreateAdminStaff, label: 'CreateAdminStaff' },
      { value: Permissions.UpdateAdminStaff, label: 'UpdateAdminStaff' },
      { value: Permissions.DeleteAdminStaff, label: 'DeleteAdminStaff' },
      { value: Permissions.ActivateAdminStaff, label: 'ActivateAdminStaff' },
      { value: Permissions.DeactivateAdminStaff, label: 'DeactivateAdminStaff' }
    ]
  },
  {
    name: 'AdminRolesAndPermissions',
    permissions: [
      { value: Permissions.ViewAdminRoles, label: 'ViewAdminRoles' },
      { value: Permissions.CreateAdminRoles, label: 'CreateAdminRoles' },
      { value: Permissions.UpdateAdminRoles, label: 'UpdateAdminRoles' },
      { value: Permissions.DeleteAdminRoles, label: 'DeleteAdminRoles' },
      { value: Permissions.AssignAdminRolePermissions, label: 'AssignAdminRolePermissions' }
    ]
  },
  {
    name: 'GlobalAppSettings',
    permissions: [
      { value: Permissions.ViewGlobalSettings, label: 'ViewGlobalSettings' },
      { value: Permissions.UpdateGlobalSettings, label: 'UpdateGlobalSettings' }
    ]
  },
  {
    name: 'SystemManagement',
    permissions: [
      { value: Permissions.ViewAuditLogs, label: 'ViewAuditLogs' },
      { value: Permissions.ExportReports, label: 'ExportReports' },
      { value: Permissions.SendNotifications, label: 'SendNotifications' },
      { value: Permissions.ViewNotifications, label: 'ViewNotifications' }
    ]
  }
];

/**
 * Company Admin Permission Categories
 * Organized by functional area for Company Admin roles
 */
export const companyPermissionCategories: PermissionCategory[] = [
  {
    name: 'CompanyRolesAndPermissions',
    permissions: [
      { value: Permissions.ViewCompanyRoles, label: 'ViewCompanyRoles' },
      { value: Permissions.CreateCompanyRoles, label: 'CreateCompanyRoles' },
      { value: Permissions.UpdateCompanyRoles, label: 'UpdateCompanyRoles' },
      { value: Permissions.DeleteCompanyRoles, label: 'DeleteCompanyRoles' },
      { value: Permissions.AssignCompanyRolePermissions, label: 'AssignCompanyRolePermissions' }
    ]
  },
  {
    name: 'BranchManagement',
    permissions: [
      { value: Permissions.ViewBranches, label: 'ViewBranches' },
      { value: Permissions.CreateBranches, label: 'CreateBranches' },
      { value: Permissions.UpdateBranches, label: 'UpdateBranches' },
      { value: Permissions.DeleteBranches, label: 'DeleteBranches' },
      { value: Permissions.ActivateBranches, label: 'ActivateBranches' },
      { value: Permissions.DeactivateBranches, label: 'DeactivateBranches' }
    ]
  },
  {
    name: 'CompanyStaffManagement',
    permissions: [
      { value: Permissions.ViewCompanyStaff, label: 'ViewCompanyStaff' },
      { value: Permissions.CreateCompanyStaff, label: 'CreateCompanyStaff' },
      { value: Permissions.UpdateCompanyStaff, label: 'UpdateCompanyStaff' },
      { value: Permissions.DeleteCompanyStaff, label: 'DeleteCompanyStaff' },
      { value: Permissions.ActivateCompanyStaff, label: 'ActivateCompanyStaff' },
      { value: Permissions.DeactivateCompanyStaff, label: 'DeactivateCompanyStaff' },
      { value: Permissions.ViewCompanyStaffDocuments, label: 'ViewStaffDocuments' }
    ]
  },
  {
    name: 'LoanOffersManagement',
    permissions: [
      { value: Permissions.ViewLoanOffers, label: 'ViewLoanOffers' },
      { value: Permissions.CreateLoanOffers, label: 'CreateLoanOffers' },
      { value: Permissions.UpdateLoanOffers, label: 'UpdateLoanOffers' },
      { value: Permissions.DeleteLoanOffers, label: 'DeleteLoanOffers' },
      { value: Permissions.ActivateLoanOffers, label: 'ActivateLoanOffers' },
      { value: Permissions.DeactivateLoanOffers, label: 'DeactivateLoanOffers' }
    ]
  },
  {
    name: 'PayrollManagement',
    permissions: [
      { value: Permissions.ViewPayroll, label: 'ViewPayroll' },
      { value: Permissions.CreatePayroll, label: 'CreatePayroll' },
      { value: Permissions.DeletePayroll, label: 'DeletePayroll' },
      { value: Permissions.GeneratePayroll, label: 'GeneratePayroll' },
      { value: Permissions.ApprovePayroll, label: 'ApprovePayroll' },
      { value: Permissions.RejectPayroll, label: 'RejectPayroll' },
      { value: Permissions.UploadPayrollProof, label: 'UploadPayrollProof' }
    ]
  },
  {
    name: 'LoanRequestsManagement',
    permissions: [
      { value: Permissions.ViewLoanRequests, label: 'ViewLoanRequests' },
      { value: Permissions.CreateLoanRequests, label: 'CreateLoanRequests' },
      { value: Permissions.UpdateLoanRequests, label: 'UpdateLoanRequests' },
      { value: Permissions.DeleteLoanRequests, label: 'DeleteLoanRequests' },
      { value: Permissions.ApproveLoanRequests, label: 'ApproveLoanRequests' },
      { value: Permissions.RejectLoanRequests, label: 'RejectLoanRequests' },
      { value: Permissions.ViewLoanRequestDocuments, label: 'ViewLoanDocuments' }
    ]
  },
  {
    name: 'LoanDashboardAndReports',
    permissions: [
      { value: Permissions.ViewLoanHistory, label: 'ViewLoanHistory' },
      { value: Permissions.ViewLoanBalance, label: 'ViewLoanBalance' },
      { value: Permissions.ViewPaymentHistory, label: 'ViewPaymentHistory' },
      { value: Permissions.ViewPaymentStatus, label: 'ViewPaymentStatus' },
      { value: Permissions.ViewActiveLoansByBranch, label: 'ViewActiveLoansByBranch' }
    ]
  },
  {
    name: 'CompanySettings',
    permissions: [
      { value: Permissions.ViewCompanySettings, label: 'ViewCompanySettings' },
      { value: Permissions.UpdateCompanySettings, label: 'UpdateCompanySettings' }
    ]
  },
  {
    name: 'CompanyReports',
    permissions: [
      { value: Permissions.ViewCompanyReports, label: 'ViewCompanyReports' },
      { value: Permissions.ExportCompanyReports, label: 'ExportCompanyReports' }
    ]
  },
  {
    name: 'Notifications',
    permissions: [
      { value: Permissions.ViewNotifications, label: 'ViewNotifications' },
      { value: Permissions.SendNotifications, label: 'SendNotifications' }
    ]
  }
];

/**
 * Employee Permission Categories
 * Organized by functional area for Employee roles
 */
export const employeePermissionCategories: PermissionCategory[] = [
  {
    name: 'EmployeeDashboard',
    permissions: [
      { value: Permissions.ViewEmployeeDashboard, label: 'ViewEmployeeDashboard' },
      { value: Permissions.ViewOwnPendingLoans, label: 'ViewOwnPendingLoans' },
      { value: Permissions.ViewOwnActiveLoans, label: 'ViewOwnActiveLoans' },
      { value: Permissions.ViewOwnLoanHistory, label: 'ViewOwnLoanHistory' }
    ]
  },
  {
    name: 'LoanApplications',
    permissions: [
      { value: Permissions.ViewAvailableOffers, label: 'ViewAvailableOffers' },
      { value: Permissions.ApplyForStandardLoan, label: 'ApplyForStandardLoan' },
      { value: Permissions.CreateCustomLoanRequest, label: 'CreateCustomLoanRequest' },
      { value: Permissions.UploadLoanDocuments, label: 'UploadLoanDocuments' }
    ]
  },
  {
    name: 'SalaryAndPayments',
    permissions: [
      { value: Permissions.RequestAdvanceSalary, label: 'RequestAdvanceSalary' },
      { value: Permissions.ViewPaymentSchedule, label: 'ViewPaymentSchedule' },
      { value: Permissions.MakeLoanPayment, label: 'MakeLoanPayment' },
      { value: Permissions.ViewRemainingBalance, label: 'ViewRemainingBalance' }
    ]
  },
  {
    name: 'EmployeeProfile',
    permissions: [
      { value: Permissions.ViewOwnProfile, label: 'ViewOwnProfile' },
      { value: Permissions.UpdateOwnProfile, label: 'UpdateOwnProfile' }
    ]
  },
  {
    name: 'EmployeeNotifications',
    permissions: [
      { value: Permissions.ViewNotifications, label: 'ViewNotifications' }
    ]
  }
];

/**
 * Helper function to get all permissions from a category array
 */
export function getAllPermissionsFromCategories(categories: PermissionCategory[]): string[] {
  return categories.flatMap(category =>
    category.permissions.map(p => p.value)
  );
}

/**
 * Helper function to check if a permission exists in categories
 */
export function hasPermissionInCategories(
  categories: PermissionCategory[],
  permissionValue: string
): boolean {
  return categories.some(category =>
    category.permissions.some(p => p.value === permissionValue)
  );
}

/**
 * Helper function to get permission label
 */
export function getPermissionLabel(
  categories: PermissionCategory[],
  permissionValue: string
): string | undefined {
  for (const category of categories) {
    const permission = category.permissions.find(p => p.value === permissionValue);
    if (permission) {
      return permission.label;
    }
  }
  return undefined;
}
