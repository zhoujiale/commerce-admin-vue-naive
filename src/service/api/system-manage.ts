import { request } from '../request';

export function fetchGetDepartmentList(params?: Api.SystemManage.DepartmentSearchParams) {
  return request<Api.SystemManage.DepartmentPage>({
    url: '/department/pages',
    method: 'get',
    params
  });
}

export function getAllDepartmentList() {
  return request<Api.SystemManage.DepartmentList>({
    url: '/department/list',
    method: 'get'
  });
}
