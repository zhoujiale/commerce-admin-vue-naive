<script setup lang="tsx">
import { computed, reactive, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { menuTypeOptions } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { addMenu, editMenu, fetchGetMenuListByType } from '@/service/api/system-manage';
import { convertToSelectFormat } from './menuUtil';
import { Api } from '@/typings/api';

defineOptions({
  name: 'MenuOperateModal'
});

export type OperateType = NaiveUI.TableOperateType | 'addChild';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit menu data or the parent menu data when adding a child menu */
  rowData?: Api.SystemManage.Menu | null;
  /** all pages */
  // allPages: string[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: $t('page.manage.menu.addMenu'),
    addChild: $t('page.manage.menu.addChildMenu'),
    edit: $t('page.manage.menu.editMenu')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Menu,
  | 'menuType'
  | 'menuName'
  | 'route'
  | 'sortNumber'
  | 'icon'
  | 'localIcon'
  | 'parentId'
  | 'isHide'
  | 'permissions'
  | 'menuKey'
  | 'component'
  | 'in18nKey'
> & {
  layout: string;
  page: string;
};

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    menuType: '1',
    menuName: '',
    menuKey: '',
    route: '',
    component: '',
    layout: '',
    page: '',
    icon: '',
    localIcon: '',
    in18nKey: '',
    parentId: 0,
    sortNumber: 0,
    isHide: false,
    permissions: []
  };
}

type RuleKey = Extract<keyof Model, 'menuName' | 'menuKey' | 'isHide' | 'route' | 'sortNumber' | 'parentId'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  menuName: defaultRequiredRule,
  menuKey: defaultRequiredRule,
  route: defaultRequiredRule,
  isHide: defaultRequiredRule,
  sortNumber: defaultRequiredRule,
  parentId: defaultRequiredRule
};

const disabledMenuType = computed(() => props.operateType === 'edit');

/** 菜单选项 */
const menuOptions = ref<SelectOption[]>([]);

/** 回调加载菜单选项 */
async function menuTypeChangeCallback(value: number) {
  const type = value - 1;
  const response = await fetchGetMenuListByType(type);
  if (response.error === null) {
    const data = response.data;
    menuOptions.value = convertToSelectFormat(data);
  }
}

// const showLayout = computed(() => model.parentId === 0);

// const showPage = computed(() => model.menuType === '2');

// const pageOptions = computed(() => {
//   const allPages = [...props.allPages];

//   if (model.route && !allPages.includes(model.route)) {
//     allPages.unshift(model.route);
//   }

//   const opts: CommonType.Option[] = allPages.map(page => ({
//     label: page,
//     value: page
//   }));

//   return opts;
// });

// const layoutOptions: CommonType.Option[] = [
//   {
//     label: 'base',
//     value: 'base'
//   },
//   {
//     label: 'blank',
//     value: 'blank'
//   }
// ];

/** the enabled role options */
// const roleOptions = ref<CommonType.Option<string>[]>([]);

// async function getRoleOptions() {
//   const { error, data } = await fetchGetAllRoles();

//   if (!error) {
//     const options = data.map((item: { roleName: any; roleCode: any }) => ({
//       label: item.roleName,
//       value: item.roleCode
//     }));

//     roleOptions.value = [...options];
//   }
// }

function handleInitModel() {
  if (!props.rowData) {
    menuTypeChangeCallback(0);
    Object.assign(model, createDefaultModel());
    return;
  }

  if (props.operateType === 'addChild') {
    const { id } = props.rowData;

    Object.assign(model, { parentId: id });
  }

  if (props.operateType === 'edit') {
    const { ...rest } = props.rowData;
    menuTypeChangeCallback(Number.parseInt(rest.menuType, 10));
    // const { layout, page } = getLayoutAndPage(component);
    // const { path, param } = getPathParamFromRoutePath(rest.routePath);
    Object.assign(model, rest, { menuType: rest.menuType.toString() });
  }
}

function closeDrawer() {
  visible.value = false;
}

// function handleCreateButton() {
//   const buttonItem: Api.SystemManage.MenuButton = {
//     code: '',
//     desc: ''
//   };

//   return buttonItem;
// }

// function getSubmitParams() {
//   const { layout, page, pathParam, ...params } = model;

//   const component = transformLayoutAndPageToComponent(layout, page);
//   const routePath = getRoutePathWithParam(model.routePath, pathParam);

//   params.component = component;
//   params.routePath = routePath;

//   return params;
// }

async function handleSubmit() {
  await validate();
  if (props.operateType === 'edit' && props.rowData) {
    const editResponse = await editMenu(props.rowData.id, model);
    if (editResponse.response.data.code === 200) {
      window.$message?.success($t('common.updateSuccess'));
    }
  } else {
    const addResponse = await addMenu(model);
    if (addResponse.response.data.code === 200) {
      window.$message?.success($t('common.addSuccess'));
    }
  }
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    // getRoleOptions();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-800px">
    <NScrollbar class="h-480px pr-20px">
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.menuType')" path="menuType">
            <NRadioGroup
              v-model:value="model.menuType"
              :disabled="disabledMenuType"
              :on-update-value="menuTypeChangeCallback"
            >
              <NRadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.menuName')" path="menuName">
            <NInput v-model:value="model.menuName" :placeholder="$t('page.manage.menu.form.menuName')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.menuKey')" path="menuKey">
            <NInput v-model:value="model.menuKey" :placeholder="$t('page.manage.menu.form.menuKey')" path="menuKey" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.route')" path="route">
            <NInput v-model:value="model.route" :placeholder="$t('page.manage.menu.form.route')" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.component')" path="component">
            <NInput
              v-model:value="model.component"
              :placeholder="$t('page.manage.menu.form.component')"
              path="component"
            />
          </NFormItemGi>
          <!--
 <NFormItemGi v-if="showLayout" span="24 m:12" :label="$t('page.manage.menu.layout')" path="layout">
            <NSelect
              v-model:value="model.layout"
              :options="layoutOptions"
              :placeholder="$t('page.manage.menu.form.layout')"
            />
          </NFormItemGi>
          <NFormItemGi v-if="showPage" span="24 m:12" :label="$t('page.manage.menu.page')" path="page">
            <NSelect
              v-model:value="model.page"
              :options="pageOptions"
              :placeholder="$t('page.manage.menu.form.page')"
            />
          </NFormItemGi>
-->
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.parentId')" path="parentId">
            <NSelect
              v-model:value="model.parentId"
              :default-value="0"
              :placeholder="$t('page.manage.menu.form.parentId')"
              :options="menuOptions"
            />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.sortNumber')" path="sortNumber">
            <NInputNumber
              v-model:value="model.sortNumber"
              class="w-full"
              :min="0"
              :placeholder="$t('page.manage.menu.form.sortNumber')"
            />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.icon')" path="icon">
            <NInput v-model:value="model.icon" :placeholder="$t('page.manage.menu.form.icon')" class="flex-1">
              <template #suffix>
                <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
              </template>
            </NInput>
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.localIcon')" path="localIcon">
            <NInput
              v-model:value="model.localIcon"
              :placeholder="$t('page.manage.menu.form.localIcon')"
              path="localIcon"
            />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" :label="$t('page.manage.menu.in18nKey')" path="in18nKey">
            <NInput
              v-model:value="model.in18nKey"
              :placeholder="$t('page.manage.menu.form.in18nKey')"
              path="in18nKey"
            />
          </NFormItemGi>
          <NFormItemGi span="24" :label="$t('page.manage.menu.permissions')">
            <NDynamicInput
              v-model:value="model.permissions"
              :value-placeholder="$t('page.manage.menu.form.permissions')"
            >
              <template #action="{ index, create, remove }">
                <NSpace class="ml-12px">
                  <NButton size="medium" @click="() => create(index)">
                    <icon-ic:round-plus class="text-icon" />
                  </NButton>
                  <NButton size="medium" @click="() => remove(index)">
                    <icon-ic-round-remove class="text-icon" />
                  </NButton>
                </NSpace>
              </template>
            </NDynamicInput>
          </NFormItemGi>
          <NFormItemGi span="24 m:24" :label="$t('page.manage.menu.isHide')" path="isHide">
            <NRadioGroup v-model:value="model.isHide">
              <NRadio :value="true" :label="$t('common.yesOrNo.yes')" />
              <NRadio :value="false" :label="$t('common.yesOrNo.no')" />
            </NRadioGroup>
          </NFormItemGi>
        </NGrid>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton v-permission="'/sysMenu/add || /sysMenu/modify/{id}'" type="primary" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
