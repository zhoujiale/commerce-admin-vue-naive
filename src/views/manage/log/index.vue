<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { deleteLog, fetchGetLogList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import LogSearch from './modules/log-search.vue';

const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetLogList,
  apiParams: {
    current: 1,
    size: 10
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'operation',
      title: $t('page.manage.log.operation'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'username',
      title: $t('page.manage.log.username'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'departmentName',
      title: $t('page.manage.log.departmentName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleName',
      title: $t('page.manage.log.roleName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'response',
      title: $t('page.manage.log.response'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'requestParams',
      title: $t('page.manage.log.requestParams'),
      align: 'center',
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'createDate',
      title: $t('page.manage.log.createDate'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NPopconfirm v-permission="'/systemLog/delete/{id}'" onPositiveClick={() => handleDelete(row.id)}>
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
const {
  checkedRowKeys,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleDelete(id: number) {
  // request
  const deleteResponse = await deleteLog(id);
  if (deleteResponse.response.data.code === 200) {
    onDeleted();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <LogSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.log.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
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
    </NCard>
  </div>
</template>

<style lang="css" scoped></style>
