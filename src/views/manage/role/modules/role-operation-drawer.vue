<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { addRole, getRole, updateRole } from '@/service/api';
import MenuTree from '../../menu/modules/menu-tree.vue';
defineOptions({
  name: 'RoleDrawer'
});
interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.Role | null;
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
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.Role, 'roleName' | 'remark' | 'id' | 'menuIdList'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    id: 0,
    roleName: '',
    remark: '',
    menuIdList: []
  };
}

type RuleKey = Exclude<keyof Model, 'remark' | 'roleName' | 'id' | 'menuIdList'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  roleName: defaultRequiredRule
};

async function handleInitModel() {
  Object.assign(model, createDefaultModel());

  if (props.operateType === 'edit' && props.rowData) {
    const roleResponse = await getRole(props.rowData.id);
    Object.assign(model, roleResponse.data);
  }
}

function handleMenuIdList(data: Array<number>) {
  model.menuIdList = data;
}

async function handleSubmit() {
  await validate();
  if (props.operateType === 'edit' && props.rowData) {
    const editResponse = await updateRole(model.id, model);
    if (editResponse.response.data.code === 200) {
      window.$message?.success($t('common.updateSuccess'));
    }
  } else {
    const addResponse = await addRole(model);
    if (addResponse.response.data.code === 200) {
      window.$message?.success($t('common.addSuccess'));
    }
  }
  closeDrawer();
  emit('submitted');
}

function closeDrawer() {
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.role.roleName')" path="roleName">
          <NInput v-model:value="model.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.remark')" path="remark">
          <NInput v-model:value="model.remark" :placeholder="$t('page.manage.role.form.remark')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.role.menuIdList')" path="menuIdList">
          <MenuTree
            v-model="model.menuIdList"
            :checked-menu-id-list="model.menuIdList"
            @get-menu-id-list="handleMenuIdList"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
