// RBAC utilities
export type Role = 'employee' | 'hr';

export const hasRole = (user: { role: Role }, role: Role) => user?.role === role;

export function withRoleGuard(Component: React.FC<any>, allowedRoles: Role[]) {
  return (props: any) => {
    const user = props.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return <div className="p-8 text-center text-red-600">Access Denied</div>;
    }
    return <Component {...props} />;
  };
}
