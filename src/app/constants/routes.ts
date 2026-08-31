import { RoleNames } from "./role-names"

export const routes = [
  {
    label: 'Dashboard',
    icon: '/assets/svg/sidebar/dashboard-icon.svg',
    route: '/dashboard/home',
  },
  {
    label: 'Users',
    icon: '/assets/svg/sidebar/staff-icon.svg',
    route: '/dashboard/user',
    roles: [RoleNames.SuperAdmin, RoleNames.Administrator, RoleNames.Manager, RoleNames.Tester],
  },
  {
    label: 'Logs',
    icon: '/assets/svg/sidebar/user-reports-icon.svg',
    route: '/dashboard/log',
    roles: [RoleNames.SuperAdmin, RoleNames.Administrator],
  },
]

