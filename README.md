# CHAT FE - CHAT APP Frontend

An production-grade Angular application for chatting with users.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.11.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [API Integration](#api-integration)
- [Component Structure](#component-structure)
- [State Management](#state-management)
- [UI Components](#ui-components)
- [Styling System](#styling-system)
- [Internationalization](#internationalization)
- [Development Workflow](#development-workflow)

---

## 📖 How The System Works

This section provides a complete overview of how the SALA FE application architecture works, from API integration to security implementation.

---

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      CHAT FE Application                        │
│                                                                 │
│  ┌───────────────┐  ┌──────────────┐  ┌────────────────┐        │
│  │   Angular UI  │←→│  API Clients │←→│  HTTP Client   │        │
│  │  Components   │  │   (NSwag)    │  │ + Interceptor  │        │
│  └───────┬───────┘  └──────┬───────┘  └────────┬───────┘        │
│          │                 │                   │                │
│          ▼                 ▼                   ▼                │
│  ┌───────────────┐  ┌──────────────┐  ┌────────────────┐        │
│  │  Auth Guard   │  │ Auth Service │  │  Error Handler │        │
│  │   (Routes)    │  │(Authenticate │  │    Service     │        │
│  │               │  │     User)    │  │                │        │
│  └───────────────┘  └──────────────┘  └────────────────┘        │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API Server                           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐             │
│  │ Auth API    │  │ Business    │  │  Database    │             │
│  │ /connect/   │  │ Logic APIs  │  │  (SQL)       │             │
│  │ token       │  │ /api/v1/*   │  │              │             │
│  └─────────────┘  └─────────────┘  └──────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🔄 Complete Request Flow

Here's what happens when a user performs an action (e.g., "View Companies"):

#### 1. **User Interaction**

```typescript
// User clicks "Companies" in sidebar
// → Angular Router navigates to /dashboard/companies
```

#### 2. **Route Guard Check** (auth-gaurd.guard.ts:44)

```typescript
// AuthGuard.checkLogin() executes:
// ✓ Check if user is logged in
// ✓ Check route requires specific role: [Administrator, CompanyAdmin]
// ✓ Check route requires permission: ViewCompanies
// ✓ If Administrator/CompanyAdmin → Allow (bypass permission check)
// ✓ If AdminStaff → Check hasPermission('ViewCompanies')
// ✓ If not authorized → Redirect to /not-found
```

#### 3. **Component Initialization**

```typescript
// companies-page.component.ts loads
ngOnInit() {
  this.getData(); // Fetch companies from API
}
```

#### 4. **API Call with Auto-Generated Client**

```typescript
// Inject NSwag-generated client
constructor(private companyClient: CompanyClient) {}

getData() {
  this.companyClient.company_GetCompanies(
    status,      // Filter params
    isActive,
    page,
    pageSize
  ).subscribe(result => {
    this.rows = result.data;  // Display data
  });
}
```

#### 5. **HTTP Interceptor** (auth-http-interceptor.ts:36)

```typescript
// Automatically intercepts ALL HTTP requests:
// ✓ Add Authorization header: Bearer {accessToken}
// ✓ Add TimeZone header
// ✓ Add Language header (en/fr)
// ✓ Check if token expired → Auto-refresh token
// ✓ Transform response
// ✓ Catch errors → Pass to ErrorHandlerService
```

#### 6. **Backend API Processing**

```typescript
// Request sent to: https://api.example.com/api/v1/companies
// Headers:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
//   TimeZone: UTC
//   Language: en
//   Content-Type: application/json
```

#### 7. **Response Handling**

```typescript
// Success (200): Data returned to component
result = {
  data: [...],        // Company list
  count: 150,         // Total count
  success: true
}

// Error (4xx/5xx): Interceptor catches error
// → ErrorHandlerService.handleError()
// → AlertService shows error message to user
// → NO need for error handling in component!
```

---

### 🔌 API Integration Architecture

#### How API Clients Are Generated (NSwag)

**The `src/app/api/api.ts` file is 100% AUTO-GENERATED from backend Swagger/OpenAPI spec.**

**Generation Process:**

```bash
# Backend exposes Swagger JSON at:
https://api.example.com/swagger/v1/swagger.json

# NSwag CLI command (example):
nswag openapi2tsclient /input:swagger.json /output:src/app/api/api.ts

# Result: Type-safe Angular service clients with:
# - All endpoints
# - All DTOs (Data Transfer Objects)
# - Request/Response models
# - Enums
# - Full TypeScript types
```

**Example Generated Client Structure:**

```typescript
// src/app/api/api.ts (auto-generated - DO NOT EDIT)

@Injectable({ providedIn: 'root' })
export class CompanyClient {
  private http: HttpClient;
  private baseUrl: string = "https://api.example.com";

  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
  }

  /**
   * Get all companies with pagination and filters
   * @param status Filter by status (0=Pending, 1=Approved, 2=Rejected)
   * @param isActive Filter by active status
   * @param search Search term
   * @param page Page number
   * @param pageSize Items per page
   * @return Company list with pagination
   */
  company_GetCompanies(
    status?: number | null,
    isActive?: boolean | null,
    search?: string | null,
    page?: number,
    pageSize?: number
  ): Observable<CompanyDtoPagedResultDto> {
    let url = this.baseUrl + "/api/v1/companies?";
    if (status !== undefined) url += "Status=" + status + "&";
    if (isActive !== undefined) url += "IsActive=" + isActive + "&";
    // ... build query params

    return this.http.request("get", url, options)
      .pipe(_observableMergeMap(response => {
        return this.processCompany_GetCompanies(response);
      }));
  }

  /**
   * Approve a company
   */
  company_ApproveCompany(
    id: string,
    model: ApproveCompanyRequestModel
  ): Observable<void> {
    let url = this.baseUrl + "/api/v1/companies/{id}/approve";
    const content = JSON.stringify(model);

    return this.http.request("post", url, { body: content });
  }

  /**
   * Reject a company
   */
  company_RejectCompany(
    id: string,
    model: RejectCompanyRequestModel
  ): Observable<void> {
    // Similar implementation
  }
}

// Auto-generated DTOs
export class CompanyDto implements ICompanyDto {
  id?: string;
  companyName?: string;
  email?: string;
  status?: CompanyStatus;
  isActive?: boolean;
  subscriptionPlan?: SubscriptionPlanDto;
  createdAt?: Date;

  constructor(data?: ICompanyDto) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static fromJS(data: any): CompanyDto {
    return new CompanyDto(data);
  }
}

export enum CompanyStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}
```

---

### 📡 Complete API Endpoint Reference

All API endpoints follow REST conventions and are organized by resource:

#### Authentication Endpoints

```
POST   /connect/token                    # Login (get access token)
POST   /connect/token (grant_type=refresh_token)  # Refresh token
```

#### Admin Role Management

```
GET    /api/v1/admin-roles               # Get all admin roles (paginated)
POST   /api/v1/admin-roles               # Create new admin role
GET    /api/v1/admin-roles/{id}          # Get admin role by ID
PUT    /api/v1/admin-roles/{id}          # Update admin role
DELETE /api/v1/admin-roles/{id}          # Delete admin role
GET    /api/v1/admin-roles/dropdown      # Get roles for dropdown
```

#### Company Management

```
GET    /api/v1/companies                 # Get all companies (paginated, filtered)
POST   /api/v1/companies                 # Create new company
GET    /api/v1/companies/{id}            # Get company by ID
PUT    /api/v1/companies/{id}            # Update company
DELETE /api/v1/companies/{id}            # Delete company
POST   /api/v1/companies/{id}/approve    # Approve company
POST   /api/v1/companies/{id}/reject     # Reject company
POST   /api/v1/companies/{id}/assign-subscription  # Assign subscription plan
```

#### Subscription Plans

```
GET    /api/v1/subscription-plans        # Get all plans
POST   /api/v1/subscription-plans        # Create plan
PUT    /api/v1/subscription-plans/{id}   # Update plan
DELETE /api/v1/subscription-plans/{id}   # Delete plan
```

#### Staff Management

```
# Admin Staff
GET    /api/v1/staff-admins              # Get all admin staff
POST   /api/v1/staff-admins              # Create admin staff
GET    /api/v1/staff-admins/{id}         # Get by ID
PUT    /api/v1/staff-admins/{id}         # Update
DELETE /api/v1/staff-admins/{id}         # Delete
POST   /api/v1/staff-admins/{id}/activate   # Activate
POST   /api/v1/staff-admins/{id}/deactivate # Deactivate

# Company Staff
GET    /api/v1/company-staff             # Get all company staff
POST   /api/v1/company-staff             # Create company staff
GET    /api/v1/company-staff/{id}        # Get by ID
PUT    /api/v1/company-staff/{id}        # Update
DELETE /api/v1/company-staff/{id}        # Delete
```

#### Branches

```
GET    /api/v1/branches                  # Get all branches
POST   /api/v1/branches                  # Create branch
GET    /api/v1/branches/{id}             # Get by ID
PUT    /api/v1/branches/{id}             # Update
DELETE /api/v1/branches/{id}             # Delete
```

#### Payroll

```
GET    /api/v1/payroll                   # Get all payroll records
POST   /api/v1/payroll                   # Create payroll
GET    /api/v1/payroll/{id}              # Get by ID
PUT    /api/v1/payroll/{id}              # Update
DELETE /api/v1/payroll/{id}              # Delete
POST   /api/v1/payroll/{id}/approve      # Approve
POST   /api/v1/payroll/{id}/reject       # Reject
POST   /api/v1/payroll/generate          # Generate payroll
```

#### Loans

```
GET    /api/v1/loan-requests             # Get all loan requests
POST   /api/v1/loan-requests             # Create loan request
GET    /api/v1/loan-requests/{id}        # Get by ID
PUT    /api/v1/loan-requests/{id}        # Update
DELETE /api/v1/loan-requests/{id}        # Delete
POST   /api/v1/loan-requests/{id}/approve  # Approve loan
POST   /api/v1/loan-requests/{id}/reject   # Reject loan
```

#### Loan Offers

```
GET    /api/v1/loan-offers               # Get all offers
POST   /api/v1/loan-offers               # Create offer
GET    /api/v1/loan-offers/{id}          # Get by ID
PUT    /api/v1/loan-offers/{id}          # Update
DELETE /api/v1/loan-offers/{id}          # Delete
```

#### Audit Logs

```
GET    /api/v1/audit-logs                # Get audit logs (filtered, paginated)
```

#### Notifications

```
GET    /api/v1/notifications             # Get user notifications
POST   /api/v1/notifications             # Send notification
PUT    /api/v1/notifications/{id}/read   # Mark as read
```

**Common Query Parameters (Pagination & Filtering):**

```typescript
{
  page: number;           // Page number (default: 1)
  pageSize: number;       // Items per page (default: 10)
  search: string;         // Search term
  orderBy: string;        // Sort column name
  isDescending: boolean;  // Sort direction
  isHideCount: boolean;   // Hide total count (performance)

  // Feature-specific filters
  status: number;         // Status filter (0,1,2)
  isActive: boolean;      // Active/Inactive filter
  // ... more filters per endpoint
}
```

**Standard Response Format:**

```typescript
// Success Response
{
  data: T | T[];          // Single item or array
  count?: number;         // Total count (for pagination)
  success: true;
  message?: string;
}

// Error Response
{
  success: false;
  message: string;        // Error message
  errors?: string[];      // Validation errors
  exception?: string;     // Exception details (dev mode)
}
```

---

### ⚠️ Error Handling System (Automatic - Already Handled!)

**IMPORTANT: You do NOT need to add error handlers in components!**

The application uses a **global HTTP interceptor** that automatically handles ALL errors:

#### How It Works

**1. HTTP Interceptor** (auth-http-interceptor.ts:140)

```typescript
intercept(req: HttpRequest, next: HttpHandler) {
  return next.handle(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // All errors caught here automatically
      this.errorHandler.handleError(error);
      return throwError(error);
    })
  );
}
```

**2. Error Handler Service** (error-handler.service.ts:15)

```typescript
handleError(error: HttpErrorResponse) {
  this.alertService.stopLoadingMessage(); // Hide loading spinner

  // Server errors (500+, 401)
  if (error.status >= 500 || error.status === 401) {
    this.alertService.showMessage(
      'Error Occurred',
      error.error?.exception || 'An error occurred while performing operation',
      MessageSeverity.error
    );
  }

  // Validation errors (400)
  if (error.error?.message) {
    this.alertService.showStickyMessage('Error', error.error.message);
  }

  // Multiple errors
  if (error.error?.errors?.length > 0) {
    error.error.errors.forEach((msg: string) => {
      this.alertService.showStickyMessage('Error', msg);
    });
  }
}
```

**3. Component Code (Clean!):**

```typescript
// ✅ CORRECT - No error handler needed
getData() {
  this.companyClient.company_GetCompanies(...)
    .subscribe(result => {
      this.rows = result.data;
      this.alertService.stopLoadingMessage();
    });
  // Error automatically handled by interceptor!
}

// ❌ WRONG - Don't add error handlers unless needed
getData() {
  this.companyClient.company_GetCompanies(...)
    .subscribe({
      next: (result) => { /* ... */ },
      error: (err) => {
        // DON'T DO THIS! Already handled globally
      }
    });
}
```

**When to Add Custom Error Handling:**

- When you need **specific** error logic different from global handler
- When you need to perform cleanup actions on error
- When you want custom error messages for specific operations

**Example of Custom Error Handling:**

```typescript
deleteCompany(id: string) {
  this.companyClient.company_DeleteCompany(id)
    .subscribe({
      next: () => {
        this.alertService.showSuccessMessage('Company deleted successfully');
        this.getData(); // Refresh list
      },
      error: (err) => {
        // Custom handling: Check if company has active subscriptions
        if (err.status === 409) {
          this.alertService.showErrorMessage(
            'Cannot delete company with active subscriptions'
          );
        }
        // Other errors handled by global interceptor
      }
    });
}
```

---

### 🛣️ Routing System Architecture

The application uses **lazy-loaded modules** with **role-based and permission-based guards**.

#### Routing Hierarchy

```
app.routes.ts
└── pages-routing.module.ts
    ├── /login                          (Public)
    ├── /sign-up                        (Public)
    ├── /forgot-password                (Public)
    ├── /reset-password                 (Public)
    ├── /verify-otp                     (Public)
    ├── /not-found                      (Public)
    └── /dashboard                      (Protected - AuthGuard)
        └── dashboard-routing.module.ts
            ├── /admin-home             (Administrator only)
            ├── /companies              (Admin + CompanyAdmin)
            ├── /subscriptions          (Administrator only)
            ├── /subscription-requests  (Administrator only)
            ├── /payments               (Administrator only)
            ├── /home                   (CompanyAdmin + Employee)
            ├── /branches               (CompanyAdmin + Employee)
            ├── /staff                  (Permission-based)
            ├── /salary                 (CompanyAdmin + Employee)
            ├── /loan                   (CompanyAdmin + Employee)
            ├── /offers                 (CompanyAdmin + Employee)
            ├── /role                   (Permission-based)
            ├── /reports                (Admin + CompanyAdmin)
            └── /settings               (Permission-based)
```

#### Route Configuration Example

**File:** `dashboard-routing.module.ts`

```typescript
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      // ========================================
      // Administrator-Only Routes
      // ========================================
      {
        path: 'admin-home',
        loadChildren: () => import('./admin-home/admin-home-routing.module')
          .then(m => m.AdminHomeRoutingModule),
        canActivateChild: [AuthGuard],     // Route guard
        data: {
          role: [RoleNames.Administrator]   // Required role
        }
      },

      // ========================================
      // Multi-Role Routes with Permission Check
      // ========================================
      {
        path: 'companies',
        loadChildren: () => import('./companies/companies-routing.module')
          .then(m => m.CompaniesRoutingModule),
        canActivateChild: [AuthGuard],
        data: {
          role: [RoleNames.Administrator, RoleNames.CompanyAdmin],
          permission: [Permissions.ViewCompanies]
          // Logic: Administrator/CompanyAdmin bypass permission check
          // Others must have ViewCompanies permission
        }
      },

      // ========================================
      // Permission-Only Routes (Any role with permission)
      // ========================================
      {
        path: 'staff',
        loadChildren: () => import('./staff/staff-routing.module')
          .then(m => m.StaffRoutingModule),
        canActivateChild: [AuthGuard],
        data: {
          // No role restriction - any user with one of these permissions
          permission: [
            Permissions.ViewAdminStaff,
            Permissions.ViewCompanyStaff
          ]
          // Logic: User needs at least ONE of these permissions (OR logic)
        }
      },

      // ========================================
      // Complex Permission Logic
      // ========================================
      {
        path: 'loan',
        loadChildren: () => import('./loan/loan-routing.module')
          .then(m => m.LoanRoutingModule),
        canActivateChild: [AuthGuard],
        data: {
          role: [RoleNames.CompanyAdmin, RoleNames.Employee],
          permission: [
            Permissions.ViewLoanRequests,      // For CompanyAdmin
            Permissions.ViewOwnActiveLoans,    // For Employee
            Permissions.ViewOwnPendingLoans    // For Employee
          ]
          // Logic:
          // - CompanyAdmin → bypass (full access)
          // - Employee → needs ViewOwnActiveLoans OR ViewOwnPendingLoans
        }
      }
    ]
  }
];
```

#### How Route Guards Work

**File:** `auth-gaurd.guard.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

  checkLogin(url: string, route: ActivatedRouteSnapshot): boolean {
    // Step 1: Check if logged in
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // Step 2: Get role and permission requirements from route
    let authRole: string[] | undefined;
    let authPermission: string[] | undefined;

    // Traverse route tree (child → parent) to find data
    let currentRoute = route;
    while (currentRoute) {
      if (!authRole && currentRoute.data['role']) {
        authRole = currentRoute.data['role'];
      }
      if (!authPermission && currentRoute.data['permission']) {
        authPermission = currentRoute.data['permission'];
      }
      currentRoute = currentRoute.parent;
    }

    // Step 3: No restrictions → Allow
    if (!authRole && !authPermission) {
      return true;
    }

    // Step 4: Administrator and CompanyAdmin bypass ALL permission checks
    if (this.authService.isAdministrator() ||
        this.authService.isCompanyAdmin()) {
      return true;
    }

    // Step 5: Check permissions (OR logic - user needs at least ONE)
    if (authPermission?.length > 0) {
      if (this.authService.hasPermissions(authPermission)) {
        return true;
      }
    }

    // Step 6: Check role (if permission check failed or not specified)
    if (authRole == null || this.authService.isRole(authRole)) {
      return true;
    }

    // Step 7: Not authorized → Redirect
    this.router.navigate(['/not-found']);
    return false;
  }
}
```

#### Lazy Loading Benefits

```typescript
// ✅ Lazy loaded - bundle split, loaded on demand
loadChildren: () => import('./companies/companies-routing.module')
  .then(m => m.CompaniesRoutingModule)

// ❌ Eager loaded - increases initial bundle size
component: CompaniesComponent
```

**Performance Impact:**

- Initial bundle: ~500KB
- Each lazy module: ~50-100KB
- Modules loaded only when user navigates to them
- Faster initial page load

---

### 👥 Role-Based Access Control (RBAC)

The application implements a **4-tier role system** with **granular permissions**.

#### Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  Role: Administrator (Super Admin)                          │
├─────────────────────────────────────────────────────────────┤
│  Power Level: FULL ACCESS (bypasses all permission checks)  │
│  Permissions: 30 admin permissions                          │
│  Landing Page: /dashboard/admin-home                        │
│  Description: System-level management                       │
│  Can:                                                        │
│    ✓ Approve/reject companies                               │
│    ✓ Manage subscription plans                              │
│    ✓ Manage admin staff                                     │
│    ✓ View all data across all companies                     │
│    ✓ View audit logs                                        │
│    ✓ Manage global settings                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Role: AdminStaff (Delegated Admin)                         │
├─────────────────────────────────────────────────────────────┤
│  Power Level: Permission-based access                       │
│  Permissions: Assigned by Administrator (subset of admin)   │
│  Landing Page: First accessible route based on permissions  │
│  Description: Staff working under Administrator             │
│  Can (based on assigned permissions):                       │
│    ✓ View/manage companies                                  │
│    ✓ View/manage subscriptions                              │
│    ✓ View reports                                           │
│    ✓ Limited admin capabilities                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Role: CompanyAdmin (Company Owner/Manager)                 │
├─────────────────────────────────────────────────────────────┤
│  Power Level: FULL ACCESS to own company (bypasses checks)  │
│  Permissions: 40 company permissions                        │
│  Landing Page: /dashboard/home                              │
│  Description: Company-level management                      │
│  Can:                                                        │
│    ✓ Manage own company                                     │
│    ✓ Create/manage branches                                 │
│    ✓ Manage company staff                                   │
│    ✓ Manage payroll                                         │
│    ✓ Manage loans & offers                                  │
│    ✓ View company reports                                   │
│    ✓ Company settings                                       │
│  Cannot:                                                     │
│    ✗ Access other companies' data                           │
│    ✗ Approve own company                                    │
│    ✗ Manage subscription plans                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Role: Employee (Company Employee)                          │
├─────────────────────────────────────────────────────────────┤
│  Power Level: Limited access - own data only               │
│  Permissions: 17 employee permissions                       │
│  Landing Page: /dashboard/home                              │
│  Description: Company employee with limited access          │
│  Can:                                                        │
│    ✓ View own salary/payroll                                │
│    ✓ View own loan requests (pending, active, history)      │
│    ✓ Apply for loans                                        │
│    ✓ View available loan offers                             │
│    ✓ View payment schedule                                  │
│    ✓ Make loan payments                                     │
│    ✓ View/update own profile                                │
│    ✓ View notifications                                     │
│  Cannot:                                                     │
│    ✗ View other employees' data                             │
│    ✗ Manage company settings                                │
│    ✗ Approve loans                                          │
│    ✗ Manage staff                                           │
└─────────────────────────────────────────────────────────────┘
```

#### Role Definition

**File:** `constants/role-names.ts`

```typescript
export class RoleNames {
  public static readonly Administrator = "Administrator";
  public static readonly AdminStaff = "AdminStaff";
  public static readonly CompanyAdmin = "CompanyAdmin";
  public static readonly Employee = "Employee";
}
```

#### Role Checking in Code

```typescript
// auth.service.ts

// Check if user has specific role
isRole(role: string | string[]): boolean {
  if (Array.isArray(role)) {
    // User must have ONE of the specified roles (OR logic)
    return this.roles?.some(r => role.includes(r)) ?? false;
  }
  return this.roles?.includes(role) ?? false;
}

// Convenience methods
isAdministrator(): boolean {
  return this.isRole(RoleNames.Administrator);
}

isCompanyAdmin(): boolean {
  return this.isRole(RoleNames.CompanyAdmin);
}

isEmployee(): boolean {
  return this.isRole(RoleNames.Employee);
}
```

**Usage in Components:**

```typescript
export class CompaniesComponent {
  constructor(public authService: AuthService) {}

  // Check single role
  canApproveCompany(): boolean {
    return this.authService.isAdministrator();
  }

  // Check multiple roles (OR logic)
  canViewCompany(): boolean {
    return this.authService.isRole([
      RoleNames.Administrator,
      RoleNames.CompanyAdmin
    ]);
  }
}
```

**Usage in Templates:**

```html
<!-- Show section only for Administrator -->
<div *ngIf="authService.isAdministrator()">
  <button (click)="approveCompany()">Approve</button>
</div>

<!-- Show for Administrator OR CompanyAdmin -->
<div *ngIf="authService.isRole([
  'Administrator',
  'CompanyAdmin'
])">
  <h2>Company Management</h2>
</div>
```

---

### 🔐 Permission System (Granular Access Control)

The application uses **90+ granular permissions** organized into categories.

#### Permission Categories

**Administrator Permissions (30 total):**

1. **Subscription Plans** (6 permissions)
   - ViewSubscriptionPlans
   - CreateSubscriptionPlans
   - UpdateSubscriptionPlans
   - DeleteSubscriptionPlans
   - AssignSubscription
   - UpdateCompanySubscription

2. **Company Management** (8 permissions)
   - ViewCompanies
   - CreateCompanies
   - UpdateCompanies
   - DeleteCompanies
   - ApproveCompanies
   - RejectCompanies
   - AssignCompanySubscriptionPlan
   - ViewCompanyDocuments

3. **Admin Staff Management** (6 permissions)
   - ViewAdminStaff
   - CreateAdminStaff
   - UpdateAdminStaff
   - DeleteAdminStaff
   - ActivateAdminStaff
   - DeactivateAdminStaff

4. **Admin Roles** (5 permissions)
   - ViewAdminRoles
   - CreateAdminRoles
   - UpdateAdminRoles
   - DeleteAdminRoles
   - AssignAdminRolePermissions

5. **Global Settings** (2 permissions)
   - ViewGlobalSettings
   - UpdateGlobalSettings

6. **System** (4 permissions)
   - ViewAuditLogs
   - ExportReports
   - SendNotifications
   - ViewNotifications

**Company Admin Permissions (40 total):**

1. **Branch Management** (6)
2. **Company Staff** (7)
3. **Payroll** (7)
4. **Loan Offers** (6)
5. **Loan Requests** (7)
6. **Company Roles** (5)
7. **Loans** (5)
8. **Company Settings** (2)
9. **Reports** (2)

**Employee Permissions (17 total):**

1. **Dashboard** (1)
2. **Loans** (3)
3. **Loan Offers** (2)
4. **Loan Requests** (2)
5. **Salary** (1)
6. **Payments** (3)
7. **Profile** (2)
8. **Transactions** (1)
9. **Notifications** (1)

#### Permission Definition

**File:** `constants/role-names.ts`

```typescript
export class Permissions {
  // Admin permissions
  public static readonly ViewSubscriptionPlans =
    'Permissions.SubscriptionPlans.View';
  public static readonly CreateSubscriptionPlans =
    'Permissions.SubscriptionPlans.Create';

  // Company permissions
  public static readonly ViewBranches =
    'Permissions.Branches.View';
  public static readonly CreateBranches =
    'Permissions.Branches.Create';

  // Employee permissions
  public static readonly ViewOwnActiveLoans =
    'Permissions.Employee.ViewOwnActiveLoans';
  public static readonly ApplyForStandardLoan =
    'Permissions.Employee.ApplyForStandardLoan';

  // Permission lists for bulk operations
  public static readonly AllAdminPermissions: string[] = [
    Permissions.ViewSubscriptionPlans,
    Permissions.CreateSubscriptionPlans,
    // ... 30 total
  ];

  public static readonly AllCompanyAdminPermissions: string[] = [
    Permissions.ViewBranches,
    Permissions.CreateBranches,
    // ... 40 total
  ];

  public static readonly AllEmployeePermissions: string[] = [
    Permissions.ViewOwnActiveLoans,
    Permissions.ApplyForStandardLoan,
    // ... 17 total
  ];
}
```

#### Permission Checking Logic

**File:** `auth.service.ts`

```typescript
// Check single permission
hasPermission(permission: string): boolean {
  // Administrator and CompanyAdmin have full access
  if (this.isAdministrator() || this.isCompanyAdmin()) {
    return true;  // Bypass permission check
  }

  // Load permissions from localStorage if not in memory
  if (!this.permissions || this.permissions.length === 0) {
    this.permissions = this.localStorage.getData(Dbkey.USER_PERMISSIONS) || [];
  }

  // Check if user has the specific permission
  return this.permissions?.includes(permission) ?? false;
}

// Check multiple permissions (OR logic - needs at least ONE)
hasPermissions(permissions: string[]): boolean {
  if (!permissions || permissions.length === 0) {
    return true;  // No permissions required
  }

  // User must have at least ONE of the specified permissions
  return permissions.some(p => this.hasPermission(p));
}

// Check multiple permissions (AND logic - needs ALL)
hasAllPermissions(permissions: string[]): boolean {
  if (!permissions || permissions.length === 0) {
    return true;
  }

  // User must have ALL specified permissions
  return permissions.every(p => this.hasPermission(p));
}
```

**Usage in Components:**

```typescript
export class StaffComponent {
  constructor(public authService: AuthService) {}

  // Single permission check
  canCreateStaff(): boolean {
    return this.authService.hasPermission(
      Permissions.CreateCompanyStaff
    );
  }

  // Multiple permissions (OR - needs at least one)
  canViewStaff(): boolean {
    return this.authService.hasPermissions([
      Permissions.ViewAdminStaff,
      Permissions.ViewCompanyStaff
    ]);
  }

  // Multiple permissions (AND - needs all)
  canDeleteAndArchive(): boolean {
    return this.authService.hasAllPermissions([
      Permissions.DeleteCompanyStaff,
      Permissions.ViewCompanyStaff
    ]);
  }
}
```

**Usage in Templates (Directive):**

```html
<!-- Single permission -->
<button *appHasPermission="'Permissions.Companies.Create'"
        (click)="createCompany()">
  {{ 'CreateCompany' | translate }}
</button>

<!-- Multiple permissions (OR logic) -->
<div *appHasPermission="[
  'Permissions.Companies.Approve',
  'Permissions.Companies.Reject'
]">
  <button (click)="approveCompany()">Approve</button>
  <button (click)="rejectCompany()">Reject</button>
</div>

<!-- Nested permission checks -->
<td class="table-cell"
    *appHasPermission="[
      'Permissions.Companies.Update',
      'Permissions.Companies.Delete'
    ]">
  <button *appHasPermission="'Permissions.Companies.Update'"
          (click)="editCompany()">
    <i class="bi bi-pencil"></i>
  </button>
  <button *appHasPermission="'Permissions.Companies.Delete'"
          (click)="deleteCompany()">
    <i class="bi bi-trash"></i>
  </button>
</td>
```

#### HasPermission Directive

**File:** `directives/has-permission.directive.ts`

```typescript
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private permissions: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appHasPermission(permissions: string | string[]) {
    this.permissions = Array.isArray(permissions)
      ? permissions
      : [permissions];
    this.updateView();
  }

  private updateView(): void {
    this.viewContainer.clear();

    // Check if user has ANY of the required permissions (OR logic)
    const hasPermission = this.authService.hasPermissions(this.permissions);

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
```

---

### 🔑 Authentication Flow (JWT Token Management)

#### Login Process

```typescript
// 1. User submits credentials
login(email: string, password: string) → LoginResponse

// 2. Backend returns JWT tokens
{
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // Short-lived (15-60 min)
  id_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",     // Contains user info
  refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Long-lived (7-30 days)
}

// 3. Decode ID token to extract user data
const decodedToken = jwtHelper.decodeToken(id_token);
{
  sub: "user-id-12345",
  email: "admin@example.com",
  name: "John Doe",
  role: "Administrator",
  Permission: [
    "Permissions.Companies.View",
    "Permissions.Companies.Create",
    // ... all user permissions
  ],
  exp: 1234567890  // Token expiry timestamp
}

// 4. Store tokens and user data in localStorage
localStorage.setItem('access_token', access_token);
localStorage.setItem('id_token', id_token);
localStorage.setItem('refresh_token', refresh_token);
localStorage.setItem('current_user', JSON.stringify(user));
localStorage.setItem('user_permissions', JSON.stringify(permissions));

// 5. Redirect to role-appropriate landing page
if (role === 'Administrator') → /dashboard/admin-home
if (role === 'CompanyAdmin') → /dashboard/home
if (role === 'Employee') → /dashboard/home
if (role === 'AdminStaff') → first accessible route based on permissions
```

#### Token Auto-Refresh

**File:** `auth-http-interceptor.ts:68`

```typescript
intercept(req: HttpRequest, next: HttpHandler) {
  // Check if token expired
  if (this.authService.isSessionExpired && !this.isRefreshing) {
    this.isRefreshing = true;

    // Call refresh token endpoint
    return this.loginService.refreshToken(this.authService.refreshToken)
      .pipe(
        mergeMap((data) => {
          this.isRefreshing = false;

          // Update tokens
          this.authService.processRefreshToken(data);

          // Clone request with new token
          const clonedRequest = req.clone({
            headers: new HttpHeaders({
              Authorization: 'Bearer ' + this.authService.accessToken,
              'Content-Type': 'application/json',
              'Language': this.authService.currentLanguage
            })
          });

          // Retry original request
          return next.handle(clonedRequest);
        }),
        catchError((err) => {
          // Refresh failed → Logout
          this.authService.logout();
          return from([]);
        })
      );
  }

  return next.handle(req);
}
```

---

### 📊 Complete Workflow Example

**Scenario:** Administrator wants to approve a pending company

#### Step-by-Step Flow

```
1. User Navigation
   ├─ User clicks "Companies" in sidebar
   ├─ Router navigates to /dashboard/companies
   └─ AuthGuard.checkLogin() executes
       ├─ ✓ User is logged in
       ├─ ✓ User has role: Administrator
       ├─ ✓ Administrator bypasses permission check
       └─ ✓ Allow navigation

2. Component Initialization
   ├─ companies-page.component.ts loads
   ├─ ngOnInit() calls getData()
   └─ getData() calls API
       ├─ this.companyClient.company_GetCompanies(
       │     status: 0,  // Pending companies
       │     page: 1,
       │     pageSize: 10
       │   )
       └─ HTTP Interceptor adds headers
           ├─ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
           ├─ TimeZone: UTC
           └─ Language: en

3. Backend API Processing
   ├─ Backend validates JWT token
   ├─ Backend checks user permissions
   ├─ Backend queries database
   └─ Backend returns response
       {
         data: [
           {
             id: "company-1",
             companyName: "Acme Corp",
             status: 0,  // Pending
             email: "admin@acme.com"
           },
           // ... more companies
         ],
         count: 25,
         success: true
       }

4. Response Handling
   ├─ HTTP Interceptor processes response
   ├─ Component receives data
   ├─ Template renders company list
   └─ User sees pending companies

5. User Action (Approve Company)
   ├─ User clicks "Approve" button on company
   ├─ Permission check in template:
   │   *appHasPermission="'Permissions.Companies.Approve'"
   │   ✓ Administrator → bypasses check → button visible
   └─ approveCompany(company) method executes
       ├─ Opens confirmation dialog
       ├─ User confirms
       └─ API call:
           this.companyClient.company_ApproveCompany(
             company.id,
             { approvalNotes: "Verified documents" }
           ).subscribe(() => {
             this.alertService.showSuccessMessage('Company approved!');
             this.getData(); // Refresh list
           });

6. Success Flow
   ├─ Backend approves company
   ├─ Backend updates database (status: 1 - Approved)
   ├─ Backend sends notification to company
   ├─ Response returns success
   ├─ AlertService shows success message
   └─ Company list refreshes (company removed from pending list)

7. Error Flow (If something goes wrong)
   ├─ Backend returns error (e.g., 400 Bad Request)
   ├─ HTTP Interceptor catches error
   ├─ ErrorHandlerService.handleError() executes
   ├─ AlertService shows error message:
   │   "Company cannot be approved. Missing required documents."
   └─ User sees error notification
```

---

## 🚀 Getting Started

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

---

## 🏗️ Project Architecture

### Folder Structure

```
src/
├── app/
│   ├── api/                    # Auto-generated API clients (NSwag)
│   ├── constants/              # App constants and configurations
│   │   ├── role-names.ts       # Role definitions (Administrator, AdminStaff, CompanyAdmin, Employee)
│   │   └── permissions.ts      # 56 granular permissions
│   ├── directives/             # Custom directives
│   │   └── has-permission.directive.ts  # Permission-based UI rendering
│   ├── gaurds/                 # Route guards
│   │   └── auth-gaurd.guard.ts # Role & permission-based route protection
│   ├── interceptor/            # HTTP interceptors
│   │   └── auth-http-interceptor.interceptor.ts  # JWT token management
│   ├── models/                 # TypeScript models/interfaces
│   ├── pages/                  # Feature modules
│   │   ├── dashboard/          # Main authenticated area (UNIFIED DASHBOARD)
│   │   │   ├── admin-home/     # Administrator dashboard (NEW)
│   │   │   ├── companies/      # Company management (Admin & CompanyAdmin)
│   │   │   ├── subscriptions/  # Subscription plans (Admin only)
│   │   │   ├── transactions/   # Transaction tracking (Admin only)
│   │   │   ├── home/           # Company/Employee dashboard
│   │   │   ├── branches/       # Branch management (Company)
│   │   │   ├── staff/          # Dual-mode: Admin Staff & Company Staff
│   │   │   │   ├── admin/      # Admin staff management
│   │   │   │   └── company/    # Company staff management
│   │   │   ├── salary/         # Payroll management (Company)
│   │   │   │   ├── salary-create-page/
│   │   │   │   ├── salary-view-page/
│   │   │   │   ├── payroll-detail-page/
│   │   │   │   ├── assigned-payroll/
│   │   │   │   └── available-staff/
│   │   │   ├── loan/           # Loan management (Company/Employee)
│   │   │   ├── offers/         # Loan offers (Company/Employee)
│   │   │   ├── role/           # Dual-mode: Admin Roles & Company Roles
│   │   │   │   ├── admin/      # Admin role management
│   │   │   │   └── company/    # Company role management
│   │   │   ├── reports/        # Reporting & audit logs
│   │   │   ├── settings/       # Application settings
│   │   │   └── logout/         # Logout functionality
│   │   ├── login/              # User authentication
│   │   ├── sign-up/            # Company registration
│   │   ├── forgot-password/    # Password recovery
│   │   ├── reset-password/     # Password reset
│   │   └── verify-otp/         # OTP verification
│   ├── pipes/                  # Custom pipes
│   ├── services/               # Business services
│   │   ├── auth.service.ts     # Authentication & permission management
│   │   ├── alert.service.ts    # Notifications & loading states
│   │   ├── sidebar.service.ts  # Sidebar state management
│   │   └── navigation.service.ts  # Router navigation
│   └── shared/                 # Shared/reusable components (30+ components)
│       ├── app-button/
│       ├── app-table/
│       ├── app-dropdown/
│       ├── app-text-field/
│       ├── sidebar/
│       ├── header/
│       ├── language-toggle/
│       └── ...
├── assets/                     # Static assets
│   └── i18n/                   # Translation files
│       ├── en.json
│       └── fr.json
└── styles.scss                 # Global styles
```

### Core Technologies

- **Angular 19.2.11**: Latest Angular framework
- **RxJS**: Reactive programming
- **NgBootstrap**: Bootstrap components for Angular
- **Tailwind CSS**: Utility-first CSS framework
- **ngx-translate**: Internationalization (i18n)
- **NSwag**: Auto-generate TypeScript API clients
- **SignalR**: Real-time notifications
- **JWT**: JSON Web Token authentication

---

## 🔐 Authentication & Authorization System

### Overview

The application implements a comprehensive **role-based access control (RBAC)** system with **granular permissions**. This allows for fine-grained control over who can access what features and perform which actions.

---

### User Roles

**File:** `src/app/constants/role-names.ts`

The application defines **4 core roles**:

```typescript
export const RoleNames = {
  Administrator: 'Administrator',        // System administrator
  AdminStaff: 'AdminStaff',             // Staff working under Administrator
  CompanyAdmin: 'CompanyAdmin',          // Company owner/manager
  Employee: 'Employee'                   // Company employee
};
```

#### Role Hierarchy

```
┌─────────────────────┐
│   Administrator     │  System-level management
└──────────┬──────────┘  - Approve/reject companies
           │             - Manage subscriptions
           │             - View all data
           ▼
┌─────────────────────┐
│    AdminStaff       │  Delegated admin tasks
└──────────┬──────────┘  - Permission-based access
           │             - Limited admin capabilities
           │
           ▼
┌─────────────────────┐
│   CompanyAdmin      │  Company-level management
└──────────┬──────────┘  - Manage own company
           │             - Create branches
           │             - Manage staff & payroll
           ▼
┌─────────────────────┐
│     Employee        │  Limited access
└─────────────────────┘  - View own salary
                         - Apply for loans
                         - Limited permissions
```

---

### Permission System

The application uses **56 granular permissions** organized into categories:

#### Administrator Permissions (28 permissions, 6 categories)

1. **Subscription Plans Management** (4 permissions)
   - `Permissions.SubscriptionPlans.View`
   - `Permissions.SubscriptionPlans.Create`
   - `Permissions.SubscriptionPlans.Update`
   - `Permissions.SubscriptionPlans.Delete`

2. **Company Management** (7 permissions)
   - `Permissions.Companies.View`
   - `Permissions.Companies.Create`
   - `Permissions.Companies.Update`
   - `Permissions.Companies.Delete`
   - `Permissions.Companies.Approve`
   - `Permissions.Companies.Reject`
   - `Permissions.Companies.AssignSubscription`

3. **Admin Staff Management** (6 permissions)
   - `Permissions.AdminStaff.View`
   - `Permissions.AdminStaff.Create`
   - `Permissions.AdminStaff.Update`
   - `Permissions.AdminStaff.Delete`
   - `Permissions.AdminStaff.Activate`
   - `Permissions.AdminStaff.Deactivate`

4. **Admin Role Management** (4 permissions)
   - `Permissions.AdminRoles.View`
   - `Permissions.AdminRoles.Create`
   - `Permissions.AdminRoles.Update`
   - `Permissions.AdminRoles.Delete`

5. **Global Settings** (2 permissions)
   - `Permissions.GlobalSettings.View`
   - `Permissions.GlobalSettings.Update`

6. **Audit & Reports** (5 permissions)
   - `Permissions.Audits.ViewAuditLogs`
   - `Permissions.Reports.ViewReports`
   - `Permissions.Reports.ExportReports`
   - `Permissions.Reports.ViewAnalytics`
   - `Permissions.Notifications.SendNotifications`

#### Company Admin Permissions (78 permissions, 9 categories)

1. **Branch Management** (6 permissions)
2. **Company Staff Management** (6 permissions)
3. **Payroll Management** (7 permissions)
4. **Loan Offers Management** (6 permissions)
5. **Loan Request Management** (6 permissions)
6. **Company Role Management** (4 permissions)
7. **Loan Viewing** (4 permissions)
8. **Company Settings** (2 permissions)
9. **Reports & Audit** (37 permissions)

#### Employee Permissions (14 permissions)

- Dashboard access
- View own loans (pending, active, history)
- Apply for loans
- Upload loan documents
- View payment schedule
- Make loan payments
- Request salary advance
- View/update own profile
- View notifications

---

### Authentication Flow

**File:** `src/app/services/auth.service.ts`

#### 1. Login Process

```typescript
// User submits credentials
login(email: string, password: string) → Observable<LoginResponse>

// Process login response
processLogin(result: LoginResponse): User | null {
  // 1. Store tokens in localStorage
  localStorage.setItem('access_token', result.access_token);
  localStorage.setItem('id_token', result.id_token);
  localStorage.setItem('refresh_token', result.refresh_token);

  // 2. Decode ID token to extract user info
  const decodedToken = jwtHelper.decodeToken(result.id_token);

  // 3. Extract permissions from token
  const rawPermissions = decodedToken['Permission'];
  let extractedPermissions: string[] = [];

  if (Array.isArray(rawPermissions)) {
    extractedPermissions = rawPermissions;
  } else if (typeof rawPermissions === 'string') {
    extractedPermissions.push(rawPermissions);
  }

  // 4. Create user object
  const user: User = {
    id: decodedToken['sub'],
    email: decodedToken['email'],
    fullName: decodedToken['name'],
    roles: [decodedToken['role']],
    permissions: extractedPermissions
  };

  return user;
}
```

#### 2. Token Management

The application uses **3 types of JWT tokens**:

```typescript
// Access Token - Short-lived (15-60 minutes)
// Used for API requests
Authorization: Bearer <access_token>

// ID Token - Contains user info & permissions
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "CompanyAdmin",
  "Permission": ["Permissions.Branches.View", "Permissions.Staff.Create", ...]
}

// Refresh Token - Long-lived (7-30 days)
// Used to obtain new access token when expired
```

#### 3. Auto-Refresh Mechanism

**File:** `src/app/interceptor/auth-http-interceptor.interceptor.ts`

```typescript
intercept(request: HttpRequest, next: HttpHandler): Observable<HttpEvent> {
  // 1. Add access token to request headers
  const token = localStorage.getItem('access_token');
  request = request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  // 2. If token expired, refresh automatically
  if (this.authService.isTokenExpired()) {
    return this.authService.refreshToken().pipe(
      switchMap(() => next.handle(request))
    );
  }

  return next.handle(request);
}
```

---

### Route Protection

**File:** `src/app/gaurds/auth-gaurd.guard.ts`

The `AuthGuard` implements both `CanActivate` and `CanActivateChild` to protect routes:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkLogin(route.url.toString(), route);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot): boolean {
    return this.checkLogin(childRoute.url.toString(), childRoute);
  }

  private checkLogin(url: string, route: ActivatedRouteSnapshot): boolean {
    // 1. Check if user is logged in
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // 2. Traverse up route tree to find role/permission requirements
    let currentRoute: ActivatedRouteSnapshot | null = route;
    let requiredRoles: string[] = [];
    let requiredPermissions: string[] = [];

    while (currentRoute) {
      if (currentRoute.data['role']) {
        requiredRoles = currentRoute.data['role'];
      }
      if (currentRoute.data['permission']) {
        requiredPermissions = currentRoute.data['permission'];
      }
      currentRoute = currentRoute.parent;
    }

    // 3. Special bypass: Administrator and CompanyAdmin get full access
    if (this.authService.isAdministrator() || this.authService.isCompanyAdmin()) {
      return true;
    }

    // 4. Check permission match (if specified)
    if (requiredPermissions.length > 0) {
      if (!this.authService.hasPermissions(requiredPermissions)) {
        this.router.navigate(['/not-found']);
        return false;
      }
    }

    // 5. Check role match (if specified)
    if (requiredRoles.length > 0) {
      if (!this.authService.hasRole(requiredRoles)) {
        this.router.navigate(['/not-found']);
        return false;
      }
    }

    return true;
  }
}
```

#### Route Declaration with Guards

**File:** `src/app/pages/dashboard/dashboard-routing.module.ts`

```typescript
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'admin-home',
        loadChildren: () => import('./admin-home/admin-home.module'),
        data: {
          role: [RoleNames.Administrator]  // Only Administrator can access
        }
      },
      {
        path: 'companies',
        loadChildren: () => import('./companies/companies.module'),
        data: {
          role: [RoleNames.Administrator, RoleNames.CompanyAdmin],
          permission: ['Permissions.Companies.View']
        }
      },
      {
        path: 'staff',
        loadChildren: () => import('./staff/staff.module'),
        data: {
          permission: ['Permissions.AdminStaff.View', 'Permissions.CompanyStaff.View']
        }
      }
    ]
  }
];
```

---

### Permission Checking in Components

#### 1. TypeScript Permission Checks

```typescript
export class CompaniesPageComponent {
  constructor(public authService: AuthService) {}

  canCreateCompany(): boolean {
    return this.authService.hasPermission('Permissions.Companies.Create');
  }

  canApproveCompany(): boolean {
    return this.authService.hasPermission('Permissions.Companies.Approve');
  }

  canDeleteCompany(): boolean {
    return this.authService.hasAllPermissions([
      'Permissions.Companies.View',
      'Permissions.Companies.Delete'
    ]);
  }
}
```

#### 2. Template-Based Permission Checks

Use the `*appHasPermission` directive:

```html
<!-- Single permission check -->
<button *appHasPermission="'Permissions.Companies.Create'"
        (click)="createCompany()">
  {{ 'CreateCompany' | translate }}
</button>

<!-- Multiple permissions (OR logic) -->
<button *appHasPermission="['Permissions.Companies.Approve', 'Permissions.Companies.Reject']"
        (click)="approveCompany()">
  {{ 'ApproveCompany' | translate }}
</button>

<!-- Disable button if no permission (alternative approach) -->
<button [disabled]="!authService.hasPermission('Permissions.Companies.Delete')"
        (click)="deleteCompany()">
  {{ 'DeleteCompany' | translate }}
</button>
```

---

### Has-Permission Directive

**File:** `src/app/directives/has-permission.directive.ts`

A structural directive that conditionally renders UI elements based on permissions:

```typescript
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private permissions: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appHasPermission(permissions: string | string[]) {
    this.permissions = Array.isArray(permissions) ? permissions : [permissions];
    this.updateView();
  }

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    // Clear the view
    this.viewContainer.clear();

    // Check if user has ANY of the required permissions (OR logic)
    const hasPermission = this.authService.hasPermissions(this.permissions);

    // Render template if user has permission
    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
```

**Usage Examples:**

```html
<!-- Show create button only for authorized users -->
<button *appHasPermission="'Permissions.Staff.Create'"
        class="btn btn-primary"
        (click)="createStaff()">
  <i class="bi bi-plus"></i> {{ 'AddStaff' | translate }}
</button>

<!-- Show action buttons based on permissions -->
<td class="table-cell" *appHasPermission="['Permissions.Companies.Update', 'Permissions.Companies.Delete']">
  <button *appHasPermission="'Permissions.Companies.Update'"
          (click)="editCompany(company)">
    <i class="bi bi-pencil"></i>
  </button>
  <button *appHasPermission="'Permissions.Companies.Delete'"
          (click)="deleteCompany(company)">
    <i class="bi bi-trash"></i>
  </button>
</td>

<!-- Conditionally render entire sections -->
<div *appHasPermission="'Permissions.Reports.ViewAnalytics'"
     class="analytics-dashboard">
  <!-- Analytics content -->
</div>
```

---

### Smart Landing Page Routing

**File:** `src/app/services/auth.service.ts`

After successful login, users are redirected to role-appropriate landing pages:

```typescript
redirectLoggedInUser(): void {
  const landingPage = this.getDefaultLandingPage();
  this.router.navigate([landingPage]);
}

getDefaultLandingPage(): string {
  const user = this.currentUser;

  if (!user || !user.roles || user.roles.length === 0) {
    return '/login';
  }

  const role = user.roles[0];

  // Role-based default landing pages
  switch (role) {
    case RoleNames.Administrator:
      return '/dashboard/admin-home';

    case RoleNames.CompanyAdmin:
      return '/dashboard/home';

    case RoleNames.Employee:
      return '/dashboard/home';

    case RoleNames.AdminStaff:
      // Find first accessible route based on permissions
      if (this.hasPermission('Permissions.Companies.View')) {
        return '/dashboard/companies';
      } else if (this.hasPermission('Permissions.AdminStaff.View')) {
        return '/dashboard/staff/admin';
      } else if (this.hasPermission('Permissions.SubscriptionPlans.View')) {
        return '/dashboard/subscriptions';
      }
      return '/dashboard/settings';

    default:
      return '/dashboard/home';
  }
}
```

---

### Sidebar Navigation Filtering

**File:** `src/app/shared/sidebar/components/app-sidebar.component.ts`

The sidebar dynamically filters navigation items based on user role and permissions:

```typescript
export class AppSidebarComponent implements OnInit {
  navSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        {
          label: 'Dashboard',
          route: '/dashboard/admin-home',
          icon: 'dashboard',
          roles: [RoleNames.Administrator]
        },
        {
          label: 'Companies',
          route: '/dashboard/companies',
          icon: 'business',
          roles: [RoleNames.Administrator, RoleNames.CompanyAdmin],
          permissions: ['Permissions.Companies.View']
        },
        {
          label: 'Subscriptions',
          route: '/dashboard/subscriptions',
          icon: 'subscriptions',
          roles: [RoleNames.Administrator],
          permissions: ['Permissions.SubscriptionPlans.View']
        },
        // ... more nav items
      ]
    }
  ];

  filteredNavSections: NavSection[] = [];

  ngOnInit(): void {
    this.filterNavigationByRole();
  }

  filterNavigationByRole(): void {
    this.filteredNavSections = this.navSections.map(section => ({
      ...section,
      items: section.items.filter(item => this.canAccessRoute(item))
    })).filter(section => section.items.length > 0);
  }

  canAccessRoute(item: NavItem): boolean {
    // 1. Check role requirement
    if (item.roles && item.roles.length > 0) {
      if (!this.authService.hasRole(item.roles)) {
        return false;
      }
    }

    // 2. Administrator and CompanyAdmin bypass permission checks
    if (this.authService.isAdministrator() || this.authService.isCompanyAdmin()) {
      return true;
    }

    // 3. Check permission requirement
    if (item.permissions && item.permissions.length > 0) {
      if (!this.authService.hasPermissions(item.permissions)) {
        return false;
      }
    }

    return true;
  }
}
```

**Result:** Each user sees only the navigation items they have access to.

---

### Permission Management in Role Dialog

**File:** `src/app/pages/dashboard/role/components/role-create-update-dialog/`

The role creation/update dialog provides a comprehensive UI for managing permissions:

#### Features

1. **Category-Based Organization**: Permissions grouped by feature category
2. **Select All in Category**: Bulk select/deselect
3. **Visual Indicators**: Shows count of selected permissions per category
4. **Summary View**: List of all selected permissions with remove option
5. **Search/Filter**: Find specific permissions quickly

```typescript
export class RoleCreateUpdateDialogComponent {
  selectedPermissions: string[] = [];

  adminPermissionCategories = [
    {
      name: 'SubscriptionPlansManagement',
      permissions: [
        { value: 'Permissions.SubscriptionPlans.View', label: 'ViewSubscriptionPlans' },
        { value: 'Permissions.SubscriptionPlans.Create', label: 'CreateSubscriptionPlans' },
        // ... more
      ]
    },
    // ... more categories
  ];

  togglePermission(permission: string): void {
    const index = this.selectedPermissions.indexOf(permission);
    if (index > -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permission);
    }
  }

  selectAllInCategory(category: any): void {
    const allSelected = category.permissions.every(p =>
      this.selectedPermissions.includes(p.value)
    );

    if (allSelected) {
      // Deselect all
      category.permissions.forEach(p => {
        const index = this.selectedPermissions.indexOf(p.value);
        if (index > -1) this.selectedPermissions.splice(index, 1);
      });
    } else {
      // Select all
      category.permissions.forEach(p => {
        if (!this.selectedPermissions.includes(p.value)) {
          this.selectedPermissions.push(p.value);
        }
      });
    }
  }
}
```

---

### Security Best Practices

#### 1. **Defense in Depth**

- Route-level guards (AuthGuard)
- Component-level permission checks
- UI-level permission directives
- API-level authorization (backend)

#### 2. **Token Security**

- Tokens stored in localStorage (consider httpOnly cookies for production)
- Automatic token refresh before expiry
- Logout clears all stored tokens
- Token validation on each request

#### 3. **Permission Validation**

- Permissions extracted from JWT ID token (server-signed)
- Permissions cannot be tampered with client-side
- Backend validates permissions on every API call
- Frontend permissions for UX only

#### 4. **Role Hierarchy**

- Administrator has full access (bypasses permission checks)
- CompanyAdmin has full access within their company
- AdminStaff and Employee require explicit permissions
- Principle of least privilege

---

## 🔌 API Integration

### How API Clients are Generated

The API clients are **auto-generated** using **NSwag** from the backend Swagger/OpenAPI specification:

```typescript
// src/app/api/api.ts
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v14.5.0.0
// </auto-generated>
//----------------------

@Injectable({ providedIn: 'root' })
export class CompanyClient {
  private http: HttpClient;
  private baseUrl: string;

  constructor(@Inject(HttpClient) http: HttpClient,
              @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    this.http = http;
    this.baseUrl = baseUrl ?? "http://localhost:5000";
  }

  /**
   * Get all companies with filters
   * @param status Filter by status (0=Pending, 1=Approved, 2=Rejected)
   * @param isActive Filter by active status
   * @param subscriptionActive Filter by subscription status
   * @param search Search term
   * @param page Page number
   * @param pageSize Items per page
   * @return Company list with pagination
   */
  company_GetCompanies(
    status?: number,
    isActive?: boolean,
    subscriptionActive?: boolean,
    isHideCount?: boolean,
    search?: string,
    isDescending?: boolean,
    page?: number,
    pageSize?: number,
    sort?: string
  ): Observable<CompanyDtoPagedResultDto> { ... }

  /**
   * Approve a company
   */
  company_ApproveCompany(id: string, model: ApproveCompanyRequestModel): Observable<void> { ... }

  /**
   * Reject a company
   */
  company_RejectCompany(id: string, model: RejectCompanyRequestModel): Observable<void> { ... }
}
```

### Using API in Components

We have two main patterns for API integration: **List Pages** and **Detail Dialogs**.

---

#### Pattern 1: List Page with Filters (Role Management Example)

**File:** `src/app/pages/dashboard/role/components/role-page/role-page.component.ts`

This example shows admin role management with full CRUD operations:

```typescript
import { AdminRoleClient, AdminRoleDto } from '../../../../../api/api';

export class RolePageComponent extends BasePaginationComponent implements OnInit {

  // 1. Inject API Client
  constructor(
    private adminRoleClient: AdminRoleClient,
    private modal: NgbModal,
    private translate: TranslateService
  ) {
    super();
  }

  // 2. Define data storage
  rows: AdminRoleDto[] = [];

  // 3. Define filter controls
  searchControl: FormControl = new FormControl<string>('', []);
  isActiveControl: FormControl = new FormControl<number | null>(null, []);

  // 4. Fetch data from API with pagination, sorting, and filtering
  protected override getData(): void {
    this.alertService.startLoadingMessage();

    const isActive = this.isActiveControl.value !== null ?
      (this.isActiveControl.value === 1) : undefined;

    this.adminRoleClient.adminRole_GetAdminRoles(
      isActive,                    // Filter: active/inactive
      false,                       // isHideCount
      this.searchControl.value,    // Search term
      this.isDescending,           // Sort direction
      this.page,                   // Current page
      this.pageSize,               // Items per page (10)
      this.sort                    // Sort column
    ).subscribe({
      next: (result) => {
        this.rows = result.data ?? [];
        this.totalPage = result.count ?? 0;
        this.setPagination();
        this.alertService.stopLoadingMessage();
      }
      // Note: No error handler - handled by global HTTP interceptor
    });
  }

  // 5. Create operation - Opens modal dialog
  createRole(): void {
    const modalRef = this.modal.open(RoleCreateUpdateDialogComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.roleType = 'admin';
    modalRef.componentInstance.isEditMode = false;

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.getData(); // Refresh list after creation
      }
    }, () => {});
  }

  // 6. Update operation - Opens modal with data
  editRole(role: AdminRoleDto): void {
    const modalRef = this.modal.open(RoleCreateUpdateDialogComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.roleType = 'admin';
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.editData = role;

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.getData(); // Refresh list after update
      }
    }, () => {});
  }

  // 7. Delete operation - With confirmation
  deleteRole(role: AdminRoleDto): void {
    const modalRef = this.modal.open(AppConfirmationDialogComponent);
    modalRef.componentInstance.message = 'YouWantToDeleteThisRole';

    modalRef.componentInstance.confirmed.subscribe(() => {
      this.alertService.startLoadingMessage();

      this.adminRoleClient.adminRole_DeleteAdminRole(role.id ?? '').subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();
          this.alertService.showSuccessMessage(
            this.translate.instant('RoleDeletedSuccessfully')
          );
          this.getData(); // Refresh list after deletion
        }
      });
    });
  }
}
```

---

#### Pattern 2: Staff Management with Role-Based API Clients

**File:** `src/app/pages/dashboard/staff/components/staff-page/staff-page.component.ts`

This shows how to handle different user types (Admin vs Company staff):

```typescript
import { StaffAdminClient, StaffAdminDto, AdminRoleClient } from '../../../../../api/api';

export class StaffPageComponent extends BasePaginationComponent implements OnInit {

  constructor(
    private staffAdminClient: StaffAdminClient,
    private adminRoleClient: AdminRoleClient,
    private modal: NgbModal,
    private translate: TranslateService
  ) {
    super();
  }

  rows: StaffAdminDto[] = [];

  // Multiple filters
  searchControl: FormControl = new FormControl<string>('', []);
  isEnabledControl: FormControl = new FormControl<number | null>(null, []);
  adminRoleControl: FormControl = new FormControl<string | null>(null, []);

  // Dropdown data loaded from API
  roleOptions: { id: string; name: string }[] = [];

  ngOnInit(): void {
    this.initializeDropdownOptions(); // Load dropdown data
    this.getData();                   // Load table data
  }

  // Load dropdown options from API
  initializeDropdownOptions(): void {
    this.adminRoleClient.adminRole_GetAdminRolesDropDown().subscribe({
      next: (result) => {
        this.roleOptions = result.data?.map(r => ({
          id: r.id ?? '',
          name: r.name ?? ''
        })) ?? [];
      }
    });
  }

  // Fetch staff with multiple filters
  protected override getData(): void {
    this.alertService.startLoadingMessage();

    const isEnabled = this.isEnabledControl.value !== null ?
      (this.isEnabledControl.value === 1) : undefined;

    this.staffAdminClient.staffAdmin_GetStaffAdmins(
      this.searchControl.value,     // Search term
      isEnabled,                     // Active/Inactive filter
      this.adminRoleControl.value,   // Role filter
      false,                         // isHideCount
      this.isDescending,
      this.page,
      this.pageSize,
      this.sort
    ).subscribe({
      next: (result) => {
        this.rows = result.data ?? [];
        this.totalPage = result.count ?? 0;
        this.setPagination();
        this.alertService.stopLoadingMessage();
      }
    });
  }

  // View staff details - fetches fresh data from API
  viewStaff(staff: StaffAdminDto): void {
    const modalRef = this.modal.open(StaffViewDialogComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    // Pass ID instead of full object - dialog will fetch fresh data
    modalRef.componentInstance.staffId = staff.id;
    modalRef.componentInstance.staffType = 'admin';
  }
}
```

---

#### Pattern 3: Create/Update Dialog Component

**File:** `src/app/pages/dashboard/role/components/role-create-update-dialog/role-create-update-dialog.component.ts`

This shows a unified dialog for creating and updating roles with permission management:

```typescript
import {
  AdminRoleClient,
  CompanyRoleClient,
  CreateAdminRoleRequestModel,
  UpdateAdminRoleRequestModel
} from '../../../../../api/api';

export class RoleCreateUpdateDialogComponent implements OnInit {
  @Input() roleType: 'admin' | 'company' = 'admin';
  @Input() editData?: AdminRoleDto | CompanyRoleDto;
  @Input() isEditMode: boolean = false;

  constructor(
    public modal: NgbActiveModal,
    public translate: TranslateService,
    private adminRoleClient: AdminRoleClient,
    private companyRoleClient: CompanyRoleClient,
    private alertService: AlertService
  ) {}

  // Form controls
  roleNameControl = new FormControl('', [CustomValidator.required()]);
  descriptionControl = new FormControl('', [CustomValidator.required()]);
  isActiveControl = new FormControl(true, []);

  selectedPermissions: string[] = [];

  ngOnInit(): void {
    if (this.isEditMode && this.editData) {
      this.populateForm(); // Load existing data
    }
  }

  // Populate form in edit mode
  populateForm(): void {
    if (!this.editData) return;

    this.roleNameControl.setValue(this.editData.name ?? '');
    this.descriptionControl.setValue(this.editData.description ?? '');
    this.isActiveControl.setValue(this.editData.isActive ?? true);

    if (this.editData.permissions && Array.isArray(this.editData.permissions)) {
      this.selectedPermissions = [...this.editData.permissions];
    }
  }

  // Submit form - delegates to create or update
  onSubmit() {
    if (this.formGroup.invalid) {
      this.alertService.showErrorMessage(
        this.translate.instant('PleaseCompleteAllRequiredFields')
      );
      return;
    }

    this.alertService.startLoadingMessage();

    if (this.isEditMode) {
      this.updateRole();
    } else {
      this.createRole();
    }
  }

  // Create new role
  createRole(): void {
    if (this.roleType === 'admin') {
      const model = new CreateAdminRoleRequestModel({
        name: this.roleNameControl.value ?? undefined,
        description: this.descriptionControl.value ?? undefined,
        permissions: this.selectedPermissions.length > 0 ?
          this.selectedPermissions : undefined
      });

      this.adminRoleClient.adminRole_CreateAdminRole(model).subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();
          this.alertService.showSuccessMessage(
            this.translate.instant('RoleCreatedSuccessfully')
          );
          this.modal.close('saved'); // Close dialog and notify parent
        }
      });
    } else {
      // Similar for company role...
    }
  }

  // Update existing role
  updateRole(): void {
    if (!this.editData?.id) return;

    if (this.roleType === 'admin') {
      const model = new UpdateAdminRoleRequestModel({
        id: this.editData.id,
        name: this.roleNameControl.value ?? undefined,
        description: this.descriptionControl.value ?? undefined,
        isActive: this.isActiveControl.value ?? true,
        permissions: this.selectedPermissions.length > 0 ?
          this.selectedPermissions : undefined
      });

      this.adminRoleClient.adminRole_UpdateAdminRole(
        this.editData.id, model
      ).subscribe({
        next: () => {
          this.alertService.stopLoadingMessage();
          this.alertService.showSuccessMessage(
            this.translate.instant('RoleUpdatedSuccessfully')
          );
          this.modal.close('saved');
        }
      });
    }
  }

  close() {
    this.modal.close();
  }
}
```

---

#### Pattern 4: View Dialog with Dynamic Data Fetching

**File:** `src/app/pages/dashboard/staff/components/staff-view-dialog/staff-view-dialog.component.ts`

This shows how to fetch fresh data when viewing details:

```typescript
import {
  StaffAdminClient,
  CompanyStaffClient,
  StaffAdminDto,
  CompanyStaffDto
} from '../../../../../api/api';

export class StaffViewDialogComponent implements OnInit {
  @Input() staffId!: string;
  @Input() staffType: 'admin' | 'company' = 'admin';

  staffData?: StaffAdminDto | CompanyStaffDto;

  constructor(
    public modal: NgbActiveModal,
    private staffAdminClient: StaffAdminClient,
    private companyStaffClient: CompanyStaffClient,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadStaffData();
  }

  // Fetch fresh data based on staff type
  loadStaffData(): void {
    this.alertService.startLoadingMessage();

    if (this.staffType === 'admin') {
      this.staffAdminClient.staffAdmin_GetStaffAdminById(this.staffId)
        .subscribe({
          next: (result) => {
            this.staffData = result.data;
            this.alertService.stopLoadingMessage();
          }
        });
    } else {
      this.companyStaffClient.companyStaff_GetCompanyStaffById(this.staffId)
        .subscribe({
          next: (result) => {
            this.staffData = result.data;
            this.alertService.stopLoadingMessage();
          }
        });
    }
  }

  close() {
    this.modal.close();
  }
}
```

**Benefits of this pattern:**

- Always displays fresh data from the server
- Dialog is responsible for fetching its own data
- Type-safe with different API clients for different user types
- Clean separation of concerns

---

### API Request Flow

```
┌─────────────────┐
│  List Page      │ User clicks "View" or "Edit"
│  Component      │
└────────┬────────┘
         │
         │ Opens modal and passes ID
         ▼
┌─────────────────┐
│  Dialog         │ Calls API to fetch data
│  Component      │
└────────┬────────┘
         │
         │ Injects API Client
         ▼
┌─────────────────┐
│  API Client     │ Makes HTTP request
│  (NSwag)        │
└────────┬────────┘
         │
         │ HTTP Request
         ▼
┌─────────────────┐
│  Backend API    │ Processes request
│                 │
└────────┬────────┘
         │
         │ Returns data
         ▼
┌─────────────────┐
│  Component      │ Subscribes to Observable
│                 │
└────────┬────────┘
         │
         │ Updates UI
         ▼
┌─────────────────┐
│  User sees      │ Fresh data displayed
│  updated UI     │
└─────────────────┘
```

---

### Permission-Based Access Control

The application implements granular permission system for both admin and company roles:

#### Permission Structure

**Admin Permissions** (6 categories, 28 permissions):

```typescript
adminPermissionCategories = [
  {
    name: 'SubscriptionPlansManagement',
    permissions: [
      { value: 'Permissions.SubscriptionPlans.View', label: 'ViewSubscriptionPlans' },
      { value: 'Permissions.SubscriptionPlans.Create', label: 'CreateSubscriptionPlans' },
      { value: 'Permissions.SubscriptionPlans.Update', label: 'UpdateSubscriptionPlans' },
      { value: 'Permissions.SubscriptionPlans.Delete', label: 'DeleteSubscriptionPlans' }
    ]
  },
  {
    name: 'CompanyManagement',
    permissions: [
      { value: 'Permissions.Companies.View', label: 'ViewCompanies' },
      { value: 'Permissions.Companies.Approve', label: 'ApproveCompanies' },
      // ... more permissions
    ]
  }
  // ... 4 more categories
];
```

**Company Permissions** (9 categories, 78 permissions):

```typescript
companyPermissionCategories = [
  {
    name: 'BranchManagement',
    permissions: [
      { value: 'Permissions.Branches.View', label: 'ViewBranches' },
      { value: 'Permissions.Branches.Create', label: 'CreateBranches' },
      { value: 'Permissions.Branches.Update', label: 'UpdateBranches' },
      { value: 'Permissions.Branches.Delete', label: 'DeleteBranches' }
    ]
  },
  {
    name: 'PayrollManagement',
    permissions: [
      { value: 'Permissions.Payroll.View', label: 'ViewPayroll' },
      { value: 'Permissions.Payroll.Generate', label: 'GeneratePayroll' },
      { value: 'Permissions.Payroll.Approve', label: 'ApprovePayroll' }
    ]
  }
  // ... 7 more categories
];
```

#### Permission Selection UI

The role dialog provides category-based permission selection:

- **Select All in Category**: Check/uncheck all permissions in a category
- **Individual Selection**: Select specific permissions
- **Visual Indicators**: Shows selected count per category (e.g., "3/6 selected")
- **Summary View**: Displays all selected permissions with ability to remove

---

### Error Handling Strategy

The application uses a **global HTTP interceptor** for centralized error handling:

#### Global Error Interceptor Pattern

```typescript
// All API calls simply handle success - errors are caught globally
this.staffAdminClient.staffAdmin_GetStaffAdmins(...)
  .subscribe({
    next: (result) => {
      this.rows = result.data ?? [];
      this.alertService.stopLoadingMessage();
    }
    // NO error handler here - handled by global interceptor
  });
```

**Benefits:**

- DRY (Don't Repeat Yourself) - No repetitive error handling
- Consistent error messages across the application
- Centralized logging and error tracking
- Cleaner component code

**When to add error handlers:**

- When you need specific error handling logic
- When you want to show custom error messages
- When you need to perform cleanup on error

---

## 📦 Component Structure

### Page Component Pattern

Each feature follows this structure:

```
companies/
├── components/
│   ├── companies-page/                    # Main page component
│   │   ├── companies.component.ts         # Logic & API calls
│   │   ├── companies.component.html       # Template
│   │   └── companies.component.scss       # Styles
│   └── companies-create-update-dialog/    # Modal dialog
│       ├── companies-create-update-dialog.component.ts
│       ├── companies-create-update-dialog.component.html
│       └── companies-create-update-dialog.component.scss
└── companies-routing.module.ts            # Routes
```

### Component Responsibilities

#### 1. **Page Component** (e.g., `companies-page.component.ts`)

- Fetches data from API
- Manages filters and pagination
- Opens dialogs
- Handles CRUD operations

#### 2. **Dialog Component** (e.g., `companies-create-update-dialog.component.ts`)

- Form management
- Create/Update/View operations
- Validation
- Submit to API

#### 3. **Shared Components** (e.g., `app-table`, `app-button`)

- Reusable UI components
- No business logic
- Input/Output properties

---

## 🎨 UI Components & Features

### Companies Page Example

The companies page demonstrates the full UI architecture:

#### 1. **Collapsible Filter Panel**

```html
<app-collapsible-panel [title]="'Filters' | translate" [isOpen]="true">
  <div class="bg-white py-4">
    <!-- Filter Controls Grid -->
    <div class="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end mb-4">

      <!-- Search Field -->
      <app-search-box
        [placeholder]="'SearchBranchesLocationsOrManagers' | translate"
        (searchChange)="handleSearch($event)">
      </app-search-box>

      <!-- Status Dropdown -->
      <app-dropdown
        [options]="statuses"
        [dropDownControl]="statusControl"
        [placeholder]="'AllStatus' | translate">
      </app-dropdown>

      <!-- Size Dropdown -->
      <app-dropdown
        [options]="sizes"
        [dropDownControl]="sizeControl"
        [placeholder]="'AllSize' | translate">
      </app-dropdown>
    </div>

    <!-- Filter Action Buttons -->
    <div class="flex justify-start gap-3">
      <app-button (clicked)="applyFilters()">
        {{ 'Filter' | translate }}
      </app-button>
      <app-button [type]="'secondary'" (clicked)="clearFilters()">
        {{ 'ClearFilters' | translate }}
      </app-button>
    </div>
  </div>
</app-collapsible-panel>
```

#### 2. **Responsive Data Table**

```html
<app-table
  [columns]="columns"
  [page]="page"
  [pageSize]="pageSize"
  [totalPage]="totalPage"
  (sortChange)="onSort($event)"
  (pageChange)="onPageChange($event)">

  <tr *ngFor="let company of rows">
    <!-- Company Name -->
    <td class="table-cell-truncate">
      {{ company.companyName || '-' }}
    </td>

    <!-- Status Badge -->
    <td class="table-cell">
      <span *ngIf="company.status === 1"
            class="bg-[#D8FACE] px-3 py-1 rounded-lg text-[#77B244]">
        {{ "Approved" | translate }}
      </span>
    </td>

    <!-- Actions -->
    <td class="table-cell">
      <button (click)="viewCompany(company)">
        <svg-icon src="/assets/svg/dashboard/companies/hide-show-icon.svg"></svg-icon>
      </button>
      <button (click)="deleteCompany(company)">
        <svg-icon src="/assets/svg/dashboard/companies/trash-icon.svg"></svg-icon>
      </button>
    </td>
  </tr>
</app-table>
```

#### 3. **Modal Dialog for View/Edit**

```typescript
viewCompany(company: CompanyDto): void {
  const modalRef = this.modal.open(CompaniesCreateUpdateDialogComponent, {
    size: 'lg',
    backdrop: 'static',
  });

  const component = modalRef.componentInstance;
  component.setViewData(company);

  modalRef.result.then((result) => {
    if (result === 'approved' || result === 'rejected') {
      this.getData(); // Refresh list
    }
  });
}
```

---

## 🎯 State Management

### Pagination Base Class

All list pages extend `BasePaginationComponent`:

```typescript
export abstract class BasePaginationComponent {
  page: number = 1;
  pageSize: number = 10;
  totalPage: number = 0;
  pages: number[] = [];
  sort: string = '';
  isDescending: boolean = false;

  protected abstract getData(): void;

  protected setPagination(): void {
    const totalPages = Math.ceil(this.totalPage / this.pageSize);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  protected sortData(head: TableHeader): void {
    this.sort = head.sort;
    this.isDescending = !this.isDescending;
    this.getData();
  }
}
```

### Form Controls

Using Angular Reactive Forms:

```typescript
// Define controls
searchControl: FormControl = new FormControl<string>('', []);
statusControl: FormControl = new FormControl<number | null>(null, []);

// Apply filters
applyFilters(): void {
  this.page = 1;
  this.getData();
}

// Clear filters
clearFilters(): void {
  this.searchControl.reset();
  this.statusControl.reset();
  this.page = 1;
  this.getData();
}
```

---

## 🎨 Styling System

### Global CSS Variables

**File:** `src/styles.scss`

```scss
:root {
  --color-primary: #2563eb;
  --color-success: #22c55e;
  --color-danger: #ef4444;
  --color-gray-50: #f9fafb;
  --color-gray-900: #111827;
  // ... more variables
}

.dark {
  --color-primary: #22c55e;
  --color-white: #1f2937;
  --color-body: #111827;
  // ... dark theme overrides
}
```

### Reusable Table Cell Classes

```scss
/* Table Cell Utilities */
.table-cell {
  padding: 0.75rem 0.75rem;
  white-space: nowrap;
  font-size: 0.75rem;
  color: var(--color-gray-500);
  max-width: 150px;

  @media (min-width: 640px) {
    padding: 1rem 1rem;
    max-width: none;
  }

  @media (min-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
  }
}

.table-cell-truncate {
  @extend .table-cell;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-cell-wrap {
  @extend .table-cell;
  white-space: normal;
  word-break: break-word;
}
```

### Tailwind CSS Integration

The project uses Tailwind CSS with custom configuration:

```html
<!-- Responsive design example -->
<div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
  <span class="text-xs sm:text-sm md:text-base">
    Responsive Text
  </span>
</div>
```

---

## 🌍 Internationalization (i18n)

### Translation Files

**English:** `public/assets/i18n/en.json`

```json
{
  "CompanyDetails": "Company Details",
  "Filters": "Filters",
  "Filter": "Filter",
  "ClearFilters": "Clear Filters",
  "Approved": "Approved",
  "Pending": "Pending",
  "Rejected": "Rejected"
}
```

**French:** `public/assets/i18n/fr.json`

```json
{
  "CompanyDetails": "Détails de l'Entreprise",
  "Filters": "Filtres",
  "Filter": "Filtrer",
  "ClearFilters": "Effacer le filtre",
  "Approved": "Approuvé",
  "Pending": "En attente",
  "Rejected": "Rejeté"
}
```

### Using Translations

```typescript
// In TypeScript
constructor(public translate: TranslateService) {}

showMessage() {
  const message = this.translate.instant('CompanyWasApprovedSuccessfully');
  this.alertService.showSuccessMessage(message);
}
```

```html
<!-- In HTML -->
<span>{{ 'CompanyDetails' | translate }}</span>
<button>{{ 'Filter' | translate }}</button>
```

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 768px (md)
- **Desktop**: 768px - 1024px (lg)
- **Large Desktop**: > 1024px (xl)

### Responsive Table

```html
<!-- Horizontal scroll on mobile -->
<div class="table-responsive">
  <table class="w-full min-w-[640px]">
    <!-- Table content -->
  </table>
</div>
```

### Responsive Grid

```html
<!-- 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
  <div>Column 4</div>
</div>
```

---

## 🔧 Development Workflow

### 1. Creating a New Feature Page

```bash
# Generate component
ng generate component pages/dashboard/my-feature/components/my-feature-page

# Generate dialog
ng generate component pages/dashboard/my-feature/components/my-feature-dialog
```

### 2. Implementing API Integration

```typescript
// 1. Import API client
import { MyFeatureClient, MyFeatureDto } from '../../../../../api/api';

// 2. Inject in constructor
constructor(private myFeatureClient: MyFeatureClient) {}

// 3. Fetch data
getData(): void {
  this.myFeatureClient.myFeature_GetAll(this.page, this.pageSize)
    .subscribe((result) => {
      this.rows = result.data ?? [];
      this.totalPage = result.count ?? 0;
    });
}
```

### 3. Adding Translations

```json
// public/assets/i18n/en.json
{
  "MyFeature": "My Feature",
  "CreateMyFeature": "Create My Feature"
}

// public/assets/i18n/fr.json
{
  "MyFeature": "Ma Fonctionnalité",
  "CreateMyFeature": "Créer Ma Fonctionnalité"
}
```

### 4. Using Shared Components

```html
<!-- Button -->
<app-button
  (clicked)="onSave()"
  [type]="'primary'">
  {{ 'Save' | translate }}
</app-button>

<!-- Dropdown -->
<app-dropdown
  [options]="options"
  [dropDownControl]="myControl"
  [placeholder]="'Select' | translate">
</app-dropdown>

<!-- Text Field -->
<app-text-field
  [fieldControl]="nameControl"
  [fieldName]="'Name' | translate"
  [placeholder]="'Enter name' | translate">
</app-text-field>
```

---

## 🧪 Testing

### Running Tests

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

---

## 🎓 Key Patterns & Best Practices

### 1. **Auto-Generated API Clients (NSwag)**

- **Never manually edit** `src/app/api/api.ts` - it's auto-generated
- API clients are type-safe and include all DTOs
- Inject clients via dependency injection
- All API methods return RxJS Observables

### 2. **Base Pagination Component**

- Extend `BasePaginationComponent` for all list pages
- Provides pagination, sorting, and filtering infrastructure
- Override `getData()` method to fetch your data

### 3. **Reactive Forms**

- Use `FormControl` for all form inputs
- Link controls to UI components via `[formControl]` or `[fieldControl]`
- Reset forms with `.reset()` method

### 4. **Component Communication**

- **Parent → Child**: Use `@Input()` properties
- **Child → Parent**: Use `@Output()` events or modal results
- **Siblings**: Use shared services

### 5. **Modal Dialogs**

- Use `NgbModal` service to open dialogs
- Pass data via `componentInstance` properties
- Handle results via `.result.then()`

### 6. **Translations**

- Always use translation keys, never hardcoded text
- Add keys to both `en.json` and `fr.json`
- Use `| translate` pipe in templates
- Use `translate.instant()` in TypeScript

### 7. **Styling**

- Use Tailwind CSS utility classes
- Use CSS variables for colors (`var(--color-primary)`)
- Create reusable classes in `styles.scss`
- Follow mobile-first responsive design

### 8. **Error Handling**

- Use `AlertService` for user notifications
- Show loading states with `startLoadingMessage()`
- Show success/error messages after operations
- Always handle API errors in `.subscribe()` error callback

---

## 📝 Example: Complete Feature Implementation

Let's create a complete "Products" feature step-by-step:

### Step 1: Create Component Files

```bash
ng generate component pages/dashboard/products/components/products-page
ng generate component pages/dashboard/products/components/products-dialog
```

### Step 2: Implement Page Component

```typescript
// products-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BasePaginationComponent } from '../../../../../shared/base-pagination-component';
import { TableHeader } from '../../../../../models/table-header';
import { ProductClient, ProductDto } from '../../../../../api/api';
import { AppTableComponent } from '../../../../../shared/app-table/...';
import { AppButtonComponent } from '../../../../../shared/app-button/...';
import { ProductsDialogComponent } from '../products-dialog/products-dialog.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe, AppTableComponent, AppButtonComponent],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent extends BasePaginationComponent implements OnInit {

  constructor(
    private productClient: ProductClient,
    public translate: TranslateService,
    private modal: NgbModal,
  ) {
    super();
  }

  rows: ProductDto[] = [];
  searchControl: FormControl = new FormControl<string>('', []);

  columns: TableHeader[] = [
    new TableHeader('ProductName', 'name', true, 'auto'),
    new TableHeader('Price', 'price', true, 'auto'),
    new TableHeader('Stock', 'stock', true, 'auto'),
    new TableHeader('Actions', '', false, 'auto'),
  ];

  ngOnInit(): void {
    this.getData();
  }

  protected override getData(): void {
    this.alertService.startLoadingMessage();

    this.productClient.product_GetAll(
      this.searchControl.value,
      this.page,
      this.pageSize,
      this.sort,
      this.isDescending
    ).subscribe((result) => {
      this.rows = result.data ?? [];
      this.totalPage = result.count ?? 0;
      this.setPagination();
      this.alertService.stopLoadingMessage();
    }, (error) => {
      this.alertService.stopLoadingMessage();
      this.alertService.showErrorMessage(
        this.translate.instant('ErrorLoadingProducts')
      );
    });
  }

  openCreateDialog(): void {
    const modalRef = this.modal.open(ProductsDialogComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.getData();
      }
    }, () => { });
  }

  editProduct(product: ProductDto): void {
    const modalRef = this.modal.open(ProductsDialogComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.setEditData(product);

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.getData();
      }
    }, () => { });
  }

  deleteProduct(product: ProductDto): void {
    if (confirm(this.translate.instant('ConfirmDeleteProduct'))) {
      this.productClient.product_Delete(product.id ?? '')
        .subscribe(() => {
          this.alertService.showSuccessMessage(
            this.translate.instant('ProductDeletedSuccessfully')
          );
          this.getData();
        });
    }
  }
}
```

### Step 3: Create Template

```html
<!-- products-page.component.html -->
<div class="p-6">
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">{{ 'Products' | translate }}</h1>
    <app-button (clicked)="openCreateDialog()">
      {{ 'AddProduct' | translate }}
    </app-button>
  </div>

  <!-- Filters -->
  <app-collapsible-panel [title]="'Filters' | translate" [isOpen]="true">
    <div class="p-4">
      <app-search-box
        [placeholder]="'SearchProducts' | translate"
        (searchChange)="searchControl.setValue($event)">
      </app-search-box>
      <app-button (clicked)="getData()" class="mt-3">
        {{ 'Filter' | translate }}
      </app-button>
    </div>
  </app-collapsible-panel>

  <!-- Table -->
  <app-table
    [columns]="columns"
    [page]="page"
    [pageSize]="pageSize"
    [totalPage]="totalPage"
    (sortChange)="onSort($event)"
    (pageChange)="onPageChange($event)">

    <tr *ngFor="let product of rows">
      <td class="table-cell-truncate">{{ product.name }}</td>
      <td class="table-cell">${{ product.price }}</td>
      <td class="table-cell">{{ product.stock }}</td>
      <td class="table-cell">
        <button (click)="editProduct(product)">Edit</button>
        <button (click)="deleteProduct(product)">Delete</button>
      </td>
    </tr>
  </app-table>
</div>
```

### Step 4: Add Translations

```json
// en.json
{
  "Products": "Products",
  "AddProduct": "Add Product",
  "SearchProducts": "Search products...",
  "ProductName": "Product Name",
  "ProductDeletedSuccessfully": "Product deleted successfully",
  "ErrorLoadingProducts": "Error loading products"
}

// fr.json
{
  "Products": "Produits",
  "AddProduct": "Ajouter un produit",
  "SearchProducts": "Rechercher des produits...",
  "ProductName": "Nom du produit",
  "ProductDeletedSuccessfully": "Produit supprimé avec succès",
  "ErrorLoadingProducts": "Erreur lors du chargement des produits"
}
```

---

## 🚀 Quick Reference

### Common Commands

```bash
# Start development server
ng serve

# Build for production
ng build --configuration production

# Generate component
ng g component pages/dashboard/my-feature/components/my-feature-page

# Generate service
ng g service services/my-service

# Run linter
ng lint

# Format code
npm run format
```

### Project URL Structure

- **Login**: `/login`
- **Dashboard**: `/dashboard`
- **Companies**: `/dashboard/companies`
- **Branches**: `/dashboard/branches`
- **Staff**: `/dashboard/staff`
- **Salary**: `/dashboard/salary`

### Key Services

- **AuthService**: Authentication & user management
- **AlertService**: Notifications (success, error, loading)
- **ConfigurationService**: App configuration
- **SidebarService**: Sidebar state management

---

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NgBootstrap Documentation](https://ng-bootstrap.github.io)
- [RxJS Documentation](https://rxjs.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)

---

## 👥 Contributing

When contributing to this project:

1. Follow the existing folder structure
2. Use the established patterns (Base Components, API Clients, etc.)
3. Add translations for all text
4. Write responsive, mobile-first UI
5. Test on multiple screen sizes
6. Use TypeScript strict mode
7. Follow Angular style guide

---

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ using Angular 19 and Tailwind CSS**
