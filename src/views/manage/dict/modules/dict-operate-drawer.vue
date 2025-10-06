<script setup lang="tsx">
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { addDict, updateDict } from '@/service/api/system-manage';
import { computed, reactive, watch } from 'vue';


defineOptions({
  name: 'DictDrawer',
});
interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.SysDict | null;
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
    add: $t('page.manage.dict.addDict'),
    edit: $t('page.manage.dict.editDict')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.SysDict,'dictKey' | 'dictName' | 'id'>;

const model = reactive(createDefaultModel());


function createDefaultModel(): Model {
  return {
    id: 0,
    dictKey: '',
    dictName: ''
  };
}

type RuleKey = Exclude<keyof Model, 'id'>;

const rules: Record<RuleKey,App.Global.FormRule> = {
  dictKey: defaultRequiredRule,
  dictName: defaultRequiredRule
}

function handleInitModel() {
  Object.assign(model, createDefaultModel());
  if(props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

async function handelSubmit() {
  await validate();
  if(props.operateType === 'edit' && props.rowData) {
    await updateDict(model.id, model);
    window.$message?.success($t('common.updateSuccess'));
  } else {
    await addDict(model);
    window.$message?.success($t('common.addSuccess'));
  }
   closeDrawer();
   emit('submitted');
}

function closeDrawer() {
  visible.value = false;
}

watch(visible,() => {
  if(visible.value) {
    handleInitModel();
    restoreValidation();
  }
})
</script>
<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.dict.dictKey')" path="dictKey">
          <NInput v-model:value="model.dictKey" :placeholder="$t('page.manage.dict.form.dictKey')"/>
        </NFormItem>
        <NFormItem :label="$t('page.manage.dict.dictName')" path="dictName">
          <NInput v-model:value="model.dictName" :placeholder="$t('page.manage.dict.form.dictName')"/>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton
          v-permission="'/sysDict/add || /sysDict/modify/{id}'"
          type="primary"
          @click="handelSubmit">{{$t('common.confirm')}}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>