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
  return request<number>({
    url: '/department/add',
    method: 'post',
    data
  });
}

/** 更新部门 */
export function updateDepartment(id: number, data: any) {
  return request<number>({
    url: `/department/modify/${id}`,
    method: 'put',
    data
  });
}

/** 删除部门 */
export function deleteDapartment(id: number) {
  return request<number>({
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
  return request<number>({
    url: '/systemMenu/add',
    method: 'post',
    data
  });
}

/** 编辑菜单 */
export function editMenu(id: number, data: any) {
  return request<number>({
    url: `/systemMenu/modify/${id}`,
    method: 'put',
    data
  });
}
