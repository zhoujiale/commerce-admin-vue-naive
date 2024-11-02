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

export function deleteDapartment(id: number) {
  return request<number>({
    url: `/department/delete/${id}`,
    method: 'delete'
  });
}
