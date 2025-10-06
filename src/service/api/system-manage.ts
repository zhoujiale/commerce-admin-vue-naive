import { Api } from '@/typings/api';
import { request } from '../request';

/** 获取部门列表 */
export function fetchGetDepartmentList(params?: Api.SystemManage.DepartmentSearchParams) {
  return request<Api.SystemManage.DepartmentPage>({
    url: '/department/pages',
    method: 'get',
    params
  });
}
/** 获取所有部门 */
export function getAllDepartmentList() {
  return request<Api.SystemManage.DepartmentList>({
    url: '/department/list',
    method: 'get'
  });
}

/** 添加部门 */
export function addDepartment(data: any) {
  return request<Api.Common.CommonOperation>({
    url: '/department/add',
    method: 'post',
    data
  });
}

/** 更新部门 */
export function updateDepartment(id: number, data: any) {
  return request<Api.Common.CommonOperation>({
    url: `/department/modify/${id}`,
    method: 'put',
    data
  });
}

/** 删除部门 */
export function deleteDapartment(id: number) {
  return request<Api.Common.CommonOperation>({
    url: `/department/delete/${id}`,
    method: 'delete'
  });
}

/** 菜单树 */
export function fetchGetMenuList(params?: Api.SystemManage.MenuSearchParams) {
  return request<Api.SystemManage.MenuPage>({
    url: '/systemMenu/tree',
    method: 'get',
    params
  });
}

/** 通过类型获取菜单 */
export function fetchGetMenuListByType(menuType: number) {
  return request<Api.SystemManage.MenuList>({
    url: `/systemMenu/systemMenuListByType?menuType=${menuType}`,
    method: 'get'
  });
}

/** 添加菜单 */
export function addMenu(data: any) {
  return request<Api.Common.CommonOperation>({
    url: '/systemMenu/add',
    method: 'post',
    data
  });
}

/** 编辑菜单 */
export function editMenu(id: number, data: any) {
  return request<Api.Common.CommonOperation>({
    url: `/systemMenu/modify/${id}`,
    method: 'put',
    data
  });
}

/** 删除菜单 */
export function deleteMenu(id: number) {
  return request<Api.Common.CommonOperation>({
    url: `/systemMenu/delete/${id}`,
    method: 'delete'
  });
}
/** 权限菜单树 */
export function menuTreeList() {
  return request<Api.SystemManage.MenuList>({
    url: '/systemMenu/treeList',
    method: 'get'
  });
}

/** 获取角色列表 */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RolePage>({
    url: '/systemRole/pages',
    method: 'get',
    params
  });
}
/** 添加角色 */
export function addRole(data: any) {
  return request<Api.Common.CommonOperation>({
    url: '/systemRole/add',
    method: 'post',
    data
  });
}
/** 编辑角色 */
export function updateRole(id: number, data: any) {
  return request<Api.Common.CommonOperation>({
    url: `/systemRole/modify/${id}`,
    method: 'put',
    data
  });
}
/** 获取角色 */
export function getRole(id: number) {
  return request<Api.SystemManage.Role>({
    url: `/systemRole/info/${id}`,
    method: 'get'
  });
}
/** 删除角色 */
export function deleteRole(id: number) {
  return request<Api.Common.CommonOperation>({
    url: `/systemRole/delete/${id}`,
    method: 'delete'
  });
}

/** 查询系统用户列表 */
export function fetchGetSystemUserList(params?: Api.SystemManage.SystemUserSearchParams) {
  return request<Api.SystemManage.SystemUserPage>({
    url: '/systemUser/pages',
    method: 'get',
    params
  });
}

/** 获取用户 */
export function getUser(id: number) {
  return request<Api.SystemManage.SystemUser>({
    url: `/systemUser/info/${id}`,
    method: 'get'
  });
}

/** 新增用户 */
export function addUser(data: any) {
  return request<Api.Common.CommonOperation>({
    url: '/systemUser/add',
    method: 'post',
    data
  });
}

/** 编辑用户 */
export function updateUser(id: number, data: any) {
  return request<Api.Common.CommonOperation>({
    url: `/systemUser/modify/${id}`,
    method: 'put',
    data
  });
}

/** 删除用户 */
export function deleteUser(id: number) {
  return request<Api.Common.CommonOperation>({
    url: `/systemUser/delete/${id}`,
    method: 'delete'
  });
}

/** 日志列表 */
export function fetchGetLogList(params?: Api.SystemManage.SystemLogSearchParams) {
  return request<Api.SystemManage.SystemLogPage>({
    url: '/systemLog/pages',
    method: 'get',
    params
  });
}

/** 删除日志 */
export function deleteLog(id: number) {
  return request<Api.Common.CommonOperation>({
    url: `/systemLog/delete/${id}`,
    method: 'delete'
  });
}

/** 字典查询  */
export function fetchGetDictList(params?: Api.SystemManage.SysDictSearchParams) {
  return request<Api.SystemManage.SysDictPage>({
    url: '/systemDict/pages',
    method: 'get',
    params
  });
}

/** 字典添加 */
export function addDict(data: any) {
  return request<Api.Common.CommonOperation>({
    url: '/systemDict/add',
    method: 'post',
    data
  });
}
/** 字典编辑 */
export function updateDict(id: number, data: any) {
  return request<Api.Common.CommonOperation>({
    url: `/systemDict/modify/${id}`,
    method: 'put',
    data
  });
}

/** 字典删除 */
export function deleteDict(id: number) {
  return request<Api.Common.CommonOperation>({
    url: `/systemDict/delete/${id}`,
    method: 'delete'
  });
}

/** 字典项查询 */
export function fetchGetDictItemList(id: number,params?: Api.SystemManage.SysDictDataSearchParams) {
  return request<Api.SystemManage.SysDictItemPage>({
    url: `/systemDict/data/pages/${id}`,
    method: 'get',
    params
  });
}

/** 字典项添加 */
export function addDictItem(data: Api.SystemManage.SysDictData) {
  return request<Api.Common.CommonOperation>({
    url: '/systemDict/addData',
    method: 'post',
    data
  });
}

/** 字典项编辑 */
export function updateDictItem(id: number, data: Api.SystemManage.SysDictData) {
  return request<Api.Common.CommonOperation>({
    url: `/systemDict/modifyData/${id}`,
    method: 'put',
    data
  });
}

/** 字典项删除 */
export function deleteDictItem(id: number) {
  return request<Api.Common.CommonOperation>({
    url: `/systemDict/deleteData/${id}`,
    method: 'delete'
  });
}