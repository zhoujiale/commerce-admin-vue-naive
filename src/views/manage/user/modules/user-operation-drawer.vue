<script setup lang="tsx">
import { computed, reactive, ref, watch } from 'vue';
import type { SelectOption, TreeSelectOption } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { addUser, fetchGetRoleList, getAllDepartmentList, getUser, updateUser } from '@/service/api/system-manage';
import { convertToTreeSelectFormat } from '../../department/modules/departmentUtil';
import { convertToSelectFormat } from '../../role/modules/roleUtil';

defineOptions({
  name: 'UserDrawer'
});
interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.SystemUser | null;
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
    add: $t('page.manage.user.addSystemUser'),
    edit: $t('page.manage.user.editSystemUser')
  };
  return titles[props.operateType];
});
type Model = Pick<
  Api.SystemManage.SystemUser,
  'username' | 'realName' | 'id' | 'password' | 'departmentId' | 'roleId' | 'userStatus'
>;
const model: Model = reactive(createDefaultModel());

type RuleKey = Exclude<keyof Model, 'id'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  username: defaultRequiredRule,
  realName: defaultRequiredRule,
  departmentId: defaultRequiredRule,
  roleId: defaultRequiredRule,
  password: defaultRequiredRule,
  userStatus: defaultRequiredRule
};

const departmentIdOptions = ref<TreeSelectOption[]>([]);
const roleIdOptions = ref<SelectOption[]>([]);

async function fetchGetAllDepartments() {
  const { data } = await getAllDepartmentList();
  if (data !== null && data.length > 0) {
    departmentIdOptions.value = convertToTreeSelectFormat(data);
  }
}

async function fetchGetAllRoles() {
  const query: Api.SystemManage.RoleSearchParams = {
    size: 100,
    current: 1
  };
  const { data } = await fetchGetRoleList(query);
  if (data !== null && data.total > 0) {
    roleIdOptions.value = convertToSelectFormat(data.records);
  }
}

async function handleInitModel() {
  Object.assign(model, createDefaultModel());
  if (props.operateType === 'edit' && props.rowData) {
    const userResponse = await getUser(props.rowData.id);
    Object.assign(model, userResponse.data);
  }
}
async function handleSubmit() {
  await validate();
  if (props.operateType === 'edit' && props.rowData) {
    const editResponse = await updateUser(model.id, model);
    if (editResponse.response.data.code === 200) {
      window.$message?.success($t('common.updateSuccess'));
    }
  } else {
    const addResponse = await addUser(model);
    if (addResponse.response.data.code === 200) {
      window.$message?.success($t('common.addSuccess'));
    }
  }
  closeDrawer();
  emit('submitted');
}
function createDefaultModel(): Model {
  return {
    id: 0,
    username: '',
    realName: '',
    password: '',
    departmentId: '',
    roleId: '',
    userStatus: '1'
  };
}
function closeDrawer() {
  visible.value = false;
}
watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    fetchGetAllDepartments();
    fetchGetAllRoles();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="500">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.user.username')" path="username">
          <NInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.username')" />
        </NFormItem>
      </NForm>
      <NFormItem :label="$t('page.manage.user.password')" path="password">
        <NInput
          v-model:value="model.password"
          type="password"
          show-password-on="mousedown"
          :placeholder="$t('page.manage.user.form.password')"
        />
      </NFormItem>
      <NFormItem :label="$t('page.manage.user.realName')" path="realName">
        <NInput v-model:value="model.realName" :placeholder="$t('page.manage.user.form.realName')" />
      </NFormItem>
      <NFormItem :label="$t('page.manage.user.departmentId')" path="departmentId">
        <NTreeSelect
          v-model:value="model.departmentId"
          :options="departmentIdOptions"
          :placeholder="$t('page.manage.user.form.departmentId')"
          clearable
        />
      </NFormItem>
      <NFormItem :label="$t('page.manage.user.roleId')" path="roleId">
        <NSelect
          v-model:value="model.roleId"
          :options="roleIdOptions"
          :placeholder="$t('page.manage.user.form.roleId')"
          clearable
        />
      </NFormItem>
      <NFormItem :label="$t('page.manage.user.userStatus')" path="userStatus">
        <NRadioGroup v-model:value="model.userStatus">
          <NRadio :value="true" :label="$t('common.commonStatus.normal')" />
          <NRadio :value="false" :label="$t('common.commonStatus.forbidden')" />
        </NRadioGroup>
      </NFormItem>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
