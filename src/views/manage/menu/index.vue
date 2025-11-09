<script setup lang="tsx">
import type { Ref } from 'vue';
import { ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { deleteMenu, fetchGetMenuList } from '@/service/api/system-manage';
import { useBoolean } from '~/packages/hooks/src';
import { $t } from '@/locales';
import { menuTypeRecord } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { yesOrNoRecord } from '@/constants/common';
import MenuOperationModal from './modules/menu-operation-modal.vue';
import type { OperateType } from './modules/menu-operation-modal.vue';
import { Api } from '@/typings/api';

const appStore = useAppStore();
const { bool: visible, setTrue: openModal } = useBoolean();
const wrapperRef = ref<HTMLElement | null>(null);
const { columns, columnChecks, loading, data, getData, getDataByPage } = useTable({
  apiFn: fetchGetMenuList,
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'id',
      title: $t('page.manage.menu.id'),
      align: 'center'
    },
    {
      key: 'menuType',
      title: $t('page.manage.menu.menuType'),
      align: 'center',
      width: 80,
      render: row => {
        const tagMap: Record<Api.SystemManage.MenuType, NaiveUI.ThemeColor> = {
          1: 'default',
          2: 'primary',
          3: 'info'
        };
        const label = $t(menuTypeRecord[row.menuType]);
        return <NTag type={tagMap[row.menuType]}>{label}</NTag>;
      }
    },
    {
      key: 'menuName',
      title: $t('page.manage.menu.menuName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'icon',
      title: $t('page.manage.menu.icon'),
      align: 'center',
      width: 60,
      render: row => {
        return (
          <div class="flex-center">
            <SvgIcon icon={row.icon} class="text-icon" />
          </div>
        );
      }
    },
    {
      key: 'route',
      title: $t('page.manage.menu.route'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'isHide',
      title: $t('page.manage.menu.isHide'),
      align: 'center',
      width: 80,
      render: row => {
        const hide: CommonType.YesOrNo = row.isHide ? 'Y' : 'N';

        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: 'error',
          N: 'default'
        };

        const label = $t(yesOrNoRecord[hide]);

        return <NTag type={tagMap[hide]}>{label}</NTag>;
      }
    },
    {
      key: 'parentId',
      title: $t('page.manage.menu.parentId'),
      width: 90,
      align: 'center'
    },
    {
      key: 'sortNumber',
      title: $t('page.manage.menu.sortNumber'),
      align: 'center',
      width: 60
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      render: row => (
        <div class="flex-center justify-end gap-8px">
          {row.menuType === '1' && (
            <NButton
              v-permission="'/sysMenu/add'"
              type="primary"
              ghost
              size="small"
              onClick={() => handleAddChildMenu(row)}
            >
              {$t('page.manage.menu.addChildMenu')}
            </NButton>
          )}
          <NButton
            v-permission="'/sysMenu/modify/{id}'"
            type="primary"
            ghost
            size="small"
            onClick={() => handleEdit(row)}
          >
            {$t('common.edit')}
          </NButton>
          <NPopconfirm v-permission="'/sysMenu/delete/{id}'" onPositiveClick={() => handleDelete(row.id)}>
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
const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, getData);
const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

async function handleDelete(id: number) {
  // request
  console.log(id);
  const deleteResonse = await deleteMenu(id);
  console.log(deleteResonse.response.data.code);
  if (deleteResonse.response.data.code === 200) {
    onDeleted();
  }
}

const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };

  openModal();
}

function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';

  editingData.value = { ...item };

  openModal();
}

const allPages = ref<string[]>([]);

async function getAllPages() {
  // const { data: pages } = await fetchGetMenuList();
  // allPages.value = pages || [];
}

function init() {
  getAllPages();
}
init();
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.manage.menu.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
        :scroll-x="1088"
        :loading="loading"
        :row-key="row => row.id"
        remote
        class="sm:h-full"
        :paginate-single-page="false"
      />
      <MenuOperationModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
