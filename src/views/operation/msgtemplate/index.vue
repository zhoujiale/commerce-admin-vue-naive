<script setup lang="tsx">
import { useTable, useTableOperate } from '@/hooks/common/table';
import { useAppStore } from '@/store/modules/app';
import MsgtemplateSerach from './modules/msgtemplate-serach.vue';
import MsgtemplateOperationModal from './modules/msgtemplate-operation-modal.vue';
import { fetchGetMsgTemplateList } from '@/service/api/operation-manage';
import { $t } from '@/locales';
import { NButton } from 'naive-ui';
import { useBoolean } from '~/packages/hooks/src';
import { Api } from '@/typings/api';
import { ref, Ref } from 'vue';

const appStore = useAppStore();
const { bool: visible, setTrue: openModal } = useBoolean();
const editingData = ref<number>();
const {
  columns,
  data,
  getData,
  searchParams,
  resetSearchParams,
  getDataByPage,
  columnChecks,
  loading,
  mobilePagination
} = useTable({
  apiFn: fetchGetMsgTemplateList,
  apiParams: {
    current: 1,
    size: 10,
    keyword: ''
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
      key: 'templateName',
      title: $t('page.operation.msgtemplate.templateName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'templateTitle',
      title: $t('page.operation.msgtemplate.templateTitle'),
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
          <NButton
            v-permission="'/sysMsgTemplate/modify/{id}'"
            type='primary'
            ghost
            size="small"
            onClick={() => handleEdit(row.id)}
          >
            {$t('common.edit')}
          </NButton>
        </div>
      )
    }
  ]
});

const {
  operateType,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);
  onBatchDeleted();
}

function handleAdd() {
  operateType.value = 'add';
  openModal();
}
function handleEdit(item: number) {
  operateType.value = 'edit';
  editingData.value = item

  openModal();

}
</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <MsgtemplateSerach v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard :title="$t('page.operation.msgtemplate.title')" :bordered="false" size="small"
      class="sm:flex-1-hidden card-wrapper">
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
      <MsgtemplateOperationModal
        v-model:visible="visible"
        :operate-type="operateType"
        :id="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>