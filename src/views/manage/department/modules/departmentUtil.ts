export function convertToTreeSelectFormat(data: Api.SystemManage.DepartmentList): any[] {
  return data.map(dept => ({
    label: dept.departmentName,
    key: dept.id,
    children: dept.children && dept.children.length > 0 ? convertToTreeSelectFormat(dept.children) : undefined
  }));
}
