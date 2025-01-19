import { transformRecordToOption } from '@/utils/common';

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.type.directory',
  '2': 'page.manage.menu.type.menu',
  '3': 'page.manage.menu.type.button'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const userStatusRecord: Record<Api.SystemManage.UserStatus, App.I18n.I18nKey> = {
  '1': 'page.manage.user.status.normal',
  '2': 'page.manage.user.status.forbidden'
};

export const userStatusOptions = transformRecordToOption(userStatusRecord);
