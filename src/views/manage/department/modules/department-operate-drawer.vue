<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { TreeSelectOption } from 'naive-ui';
import { NTreeSelect } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { addDepartment, getAllDepartmentList, updateDepartment } from '@/service/api';
import { convertToTreeSelectFormat } from './departmentUtil';

defineOptions({
  name: 'DepartmentDrawer'
});
interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.Department | null;
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
    add: $t('page.manage.department.addDepartment'),
    edit: $t('page.manage.department.editDepartment')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.Department, 'departmentName' | 'remark' | 'parentId' | 'id'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    id: 0,
    departmentName: '',
    remark: '',
    parentId: 0
  };
}

type RuleKey = Exclude<keyof Model, 'remark' | 'parentId' | 'id'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  departmentName: defaultRequiredRule
};

const options = ref<TreeSelectOption[]>([]);

const fetchAllDepartmentData = async () => {
  const response = await getAllDepartmentList();
  if (response.data !== null) {
    options.value = convertToTreeSelectFormat(response.data);
  }
};

function handleInitModel() {
  Object.assign(model, createDefaultModel());

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

async function handleSubmit() {
  await validate();
  if (props.operateType === 'edit' && props.rowData) {
    await updateDepartment(model.id, model);
    window.$message?.success($t('common.updateSuccess'));
  } else {
    await addDepartment(model);
    window.$message?.success($t('common.addSuccess'));
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
    fetchAllDepartmentData();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.department.departmentName')" path="departmentName">
          <NInput
            v-model:value="model.departmentName"
            :placeholder="$t('page.manage.department.form.departmentName')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.manage.department.parentId')" path="parentId">
          <NTreeSelect v-model:value="model.parentId" :default-value="0" :options="options" clearable />
        </NFormItem>
        <NFormItem :label="$t('page.manage.department.remark')" path="remark">
          <NInput v-model:value="model.remark" :placeholder="$t('page.manage.department.form.remark')" />
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
