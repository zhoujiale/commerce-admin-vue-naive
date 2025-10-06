<script setup lang="tsx">

import { NButton, NPopconfirm, NTag } from 'naive-ui';
import DictSearch from './modules/dict-search.vue';
import DictDrawer from './modules/dict-operate-drawer.vue';
import { deleteDict, fetchGetDictList } from '@/service/api/system-manage';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { useRouterPush } from '@/hooks/common/router';

const appStore = useAppStore();

const { routerPushByKey } = useRouterPush();


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
  apiFn: fetchGetDictList,
  apiParams: {
    current: 1,
    size: 10,
    dictKey: null,
    dictName: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'id',
      title: $t('common.index'),
      width: 64,
      align: 'center'
    },
    {
      key: 'dictKey',
      title: $t('page.manage.dict.dictKey'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'dictName',
      title: $t('page.manage.dict.dictName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'hasChildren',
      title: $t('page.manage.dict.hasChildren'),
      align: 'center',
      minWidth: 50,
      render: row => {
        const label = row.hasChildren ? '是' : '否';
        return <NTag>{label}</NTag>
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 200,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton
            v-permission="'/systemDict/modify/{id}'"
            type="primary"
            ghost
            size="small"
            onClick={() => edit(row.id)}
          >
            {$t('common.edit')}
          </NButton>
          <NButton
            size='small'
            onClick={() =>
            routerPushByKey('manage_dictdata',{query : {id: row.id}})}
          >
            {$t('page.manage.dict.dictValue')}
          </NButton>
          <NPopconfirm v-permission="'/systemDict/delete/{id}'" onPositiveClick={() => handleDelete(row.id)}>
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
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);


async function handleDelete(id: number) {
  const deleteResponse = await deleteDict(id);
  if (deleteResponse.response.data.code === 200) {
    window.$message?.success($t('common.deleteSuccess'));
    onDeleted();
  }
}

function edit(id: number){
  handleEdit(id);
}
</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DictSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.manage.dict.title')"
      :bordered="false"
      size="small"
      class="sm:flex-1-hidden card-wrapper"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
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
      <DictDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>
