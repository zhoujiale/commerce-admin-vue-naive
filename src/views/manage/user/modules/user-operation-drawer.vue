<script setup lang="tsx">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { SelectOption, TreeSelectOption } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { addUser, fetchGetRoleList, getAllDepartmentList, getUser, updateUser } from '@/service/api/system-manage';
import { convertToSelectFormat } from '@/views/manage/role/modules/roleUtil';
import { convertToTreeSelectFormat } from '@/views/manage/department/modules/departmentUtil';
import { md5Encode } from '@/utils/md5';
import { formatTimestamp } from '@/utils/dateUtil';

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
  'username' | 'realName' | 'id' | 'password' | 'departmentId' | 'roleId' | 'userStatus' | 'contactInfo' | 'expireDate'
>;
const model: Model = reactive(createDefaultModel());

type RuleKey = Extract<
  keyof Model,
  'username' | 'realName' | 'departmentId' | 'roleId' | 'password' | 'userStatus' | 'contactInfo' | 'expireDate'
>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  username: defaultRequiredRule,
  realName: defaultRequiredRule,
  departmentId: defaultRequiredRule,
  roleId: defaultRequiredRule,
  password: defaultRequiredRule,
  userStatus: defaultRequiredRule,
  contactInfo: defaultRequiredRule,
  expireDate: defaultRequiredRule
};

const departmentIdOptions = ref<TreeSelectOption[]>([]);
const roleIdOptions = ref<SelectOption[]>([]);
const changePassword = ref<boolean>(false);

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
    const data = userResponse.data;
    if (data !== null) {
      data.password = '********';
    }
    Object.assign(model, data);
  }
}
async function handleSubmit() {
  await validate();
  if (props.operateType === 'edit' && props.rowData) {
    const password = changePassword.value ? md5Encode(model.password) : '';
    const data = {
      username: model.username,
      password,
      realName: model.realName,
      departmentId: model.departmentId,
      roleId: model.roleId,
      contactInfo: model.contactInfo,
      expireDate: formatTimestamp(model.expireDate),
      userStatus: model.userStatus
    };
    const editResponse = await updateUser(model.id, data);
    if (editResponse.response.data.code === 200) {
      window.$message?.success($t('common.updateSuccess'));
    }
  } else {
    const data = {
      username: model.username,
      password: md5Encode(model.password),
      realName: model.realName,
      departmentId: model.departmentId,
      roleId: model.roleId,
      contactInfo: model.contactInfo,
      expireDate: formatTimestamp(model.expireDate),
      userStatus: model.userStatus
    };
    const addResponse = await addUser(data);
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
    roleId: null,
    userStatus: '1',
    expireDate: getNextMonth().getTime(),
    contactInfo: ''
  };
}
function closeDrawer() {
  visible.value = false;
}

function getNextMonth() {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  return now;
}

function handlePasswordInput(value: string) {
  changePassword.value = true;
  model.password = value;
}
watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    fetchGetAllRoles();
    fetchGetAllDepartments();
  }
});
onMounted(() => {
  fetchGetAllRoles();
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="500">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.user.username')" path="username">
          <NInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.username')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.password')" path="password">
          <NInput
            v-model:value="model.password"
            type="password"
            show-password-on="mousedown"
            :placeholder="$t('page.manage.user.form.password')"
            @input="handlePasswordInput"
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.realName')" path="realName">
          <NInput v-model:value="model.realName" :placeholder="$t('page.manage.user.form.realName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.roleId')" path="roleId">
          <NSelect
            v-model:value="model.roleId"
            :options="roleIdOptions"
            :placeholder="$t('page.manage.user.form.roleId')"
            clearable
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.departmentId')" path="departmentId">
          <NTreeSelect
            v-model:value="model.departmentId"
            :options="departmentIdOptions"
            :placeholder="$t('page.manage.user.form.departmentId')"
            clearable
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.expireDate')" path="expireDate">
          <NDatePicker
            v-model:value="model.expireDate"
            :placeholder="$t('page.manage.user.form.expire')"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            clearable
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.contactInfo')" path="contactInfo">
          <NInput
            v-model:value="model.contactInfo"
            :placeholder="$t('page.manage.user.form.contactInfo')"
            type="textarea"
            :maxlength="20"
            show-count
            clearable
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.user.userStatus')" path="userStatus">
          <NRadioGroup v-model:value="model.userStatus">
            <NRadio :value="1" :label="$t('common.commonStatus.normal')" />
            <NRadio :value="2" :label="$t('common.commonStatus.forbidden')" />
          </NRadioGroup>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton v-premisson="'/sysUser/add || /sysUser/modify/{id}'" type="primary" @click="handleSubmit">
            {{ $t('common.confirm') }}
          </NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
