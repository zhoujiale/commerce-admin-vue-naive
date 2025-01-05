import type { TreeOption } from 'naive-ui';

export function convertToSelectFormat(data: Api.SystemManage.MenuList): any[] {
  return data.map(menu => ({
    label: menu.menuName,
    value: menu.id
  }));
}

export function convertToTreeSelectFormat(data: Api.SystemManage.MenuList): TreeOption[] {
  return data.map(menu => ({
    label: menu.menuName,
    key: menu.id,
    children: menu.children ? convertToTreeSelectFormat(menu.children) : [],
    isLeaf: !menu.children
  }));
}
