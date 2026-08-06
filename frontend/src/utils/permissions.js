export function hasPermission(user, permission) {
  if (!user) return false
  if (user.role === 'Admin') return true
  return Array.isArray(user.permissions) && user.permissions.includes(permission)
}
