import { Api } from '@/typings/api';
import { request } from '../request';
import { AnyNaptrRecord } from 'node:dns';

/** 获取消息模板列表 */
export function fetchGetMsgTemplateList(params?: Api.Operation.MsgTemplateSearchParams) {
  return request<Api.Operation.MsgTemplatePage>({
    url: '/msgTemplate/pages',
    method: 'get',
    params
  });
}

/** 添加消息模板 */
export function addMsgTemplate(data: any) {
  return request<Api.Common.CommonOperation>({
    url: '/msgTemplate/add',
    method: 'post',
    data
  });
}

/** 编辑消息模板 */
export function updateMsgTemplate(id: number, data: any) {
  return request<Api.Common.CommonOperation>({
    url: `/msgTemplate/update/${id}`,
    method: 'put',
    data
  });
}

/** 获取消息模板 */
export function getMsgTemplate(id: number) {
  return request<Api.Operation.MsgTemplate>({
    url: `/msgTemplate/info/${id}`,
    method: 'get'
  });
}

/** 删除消息模板 */
export function deleteMsgTemplate(id: number) {
  return request<Api.Common.CommonOperation>({
    url: `/msgTemplate/delete/${id}`,
    method: 'delete'
  });
}