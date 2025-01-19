<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { deleteUser, fetchGetSystemUserList } from '@/service/api/system-manage';
import { $t } from '@/locales';
import { userStatusRecord } from '@/constants/business';
import UserSerach from './modules/user-serach.vue';
import UserDrawer from './modules/user-operation-drawer.vue';

const appStore = useAppStore();

const {
  columns,
  data,
  searchParams,
  resetSearchParams,
  getDataByPage,
  columnChecks,
  loading,
  getData,
  mobilePagination
} = useTable({
  apiFn: fetchGetSystemUserList,
  apiParams: {
    current: 1,
    size: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    username: null,
    realName: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      width: 64,
      align: 'center'
    },
    {
      key: 'username',
      title: $t('page.manage.user.username'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'realName',
      title: $t('page.manage.user.realName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'departmentName',
      title: $t('page.manage.user.departmentName'),
      align: 'center',
      minWidth: 120,
      render: row => {
        const label = row.isAdmin ? '总部' : row.departmentName;
        return <p>{label}</p>;
      }
    },
    {
      key: 'roleName',
      title: $t('page.manage.user.roleName'),
      align: 'center',
      minWidth: 120,
      render: row => {
        const label = row.isAdmin ? '超级管理员' : row.roleName;
        return <p>{label}</p>;
      }
    },
    {
      key: 'userStatus',
      title: $t('page.manage.user.userStatus'),
      align: 'center',
      minWidth: 120,
      render: row => {
        const tagMap: Record<Api.SystemManage.UserStatus, NaiveUI.ThemeColor> = {
          1: 'default',
          2: 'warning'
        };
        const label = $t(userStatusRecord[row.userStatus]);
        return <NTag type={tagMap[row.userStatus]}>{label}</NTag>;
      }
    },
    {
      key: 'isAdmin',
      title: $t('page.manage.user.isAdmin'),
      align: 'center',
      minWidth: 120,
      render: row => {
        const label = row.isAdmin ? '是' : '否';
        return <NTag>{label}</NTag>;
      }
    },
    {
      key: 'createDate',
      title: $t('page.manage.user.createDate'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});
const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

async function handleDelete(id: number) {
  // request
  const deleteResponse = await deleteUser(id);
  if (deleteResponse.response.data.code === 200) {
    onDeleted();
  }
}
function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSerach v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <UserDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>
