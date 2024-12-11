export function convertToSelectFormat(data: Api.SystemManage.MenuList): any[] {
  return data.map(menu => ({
    label: menu.menuName,
    value: menu.id
  }));
}
