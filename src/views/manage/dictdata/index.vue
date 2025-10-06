<script setup lang="tsx">

import { NButton, NPopconfirm } from 'naive-ui';
import { deleteDictItem, fetchGetDictItemList } from '@/service/api/system-manage';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { useRoute } from 'vue-router';
import DictDataSearch from './modules/dictdata-search.vue';
import DictDataDrawer from './modules/dictdata-operate-drawer.vue';

const appStore = useAppStore();
const route = useRoute();
const id: number = route.query.id as unknown as number;

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
  apiFn: (apiParams) => fetchGetDictItemList(id,apiParams),
  apiParams: {
    id: id,
    current: 1,
    size: 10,
    dictDataName: '',
    dictName: '',
    dictData: '',
    dictKey: '',
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
      key: 'dictDataName',
      title: $t('page.manage.dictdata.dictDataName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'dictData',
      title: $t('page.manage.dictdata.dictData'),
      align: 'center',
      minWidth: 100
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
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 200,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton
            v-permission="'/systemDict/modifyData/{id}'"
            type="primary"
            ghost
            size="small"
            onClick={() => edit(row.id)}
          >
            {$t('common.edit')}
          </NButton>
          <NPopconfirm v-permission="'/systemDict/deleteData/{id}'" onPositiveClick={() => handleDelete(row.id)}>
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
  const deleteResponse = await deleteDictItem(id);
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
    <DictDataSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard
      :title="$t('page.manage.dictdata.title')"
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
      <DictDataDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        :id="id"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>
