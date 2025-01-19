export function convertToSelectFormat(data: Api.SystemManage.RoleList): any[] {
  return data.map(role => ({
    label: role.roleName,
    value: role.id
  }));
}
