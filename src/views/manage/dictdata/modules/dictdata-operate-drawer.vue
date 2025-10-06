<script setup lang="tsx">
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { addDict, addDictItem, updateDict, updateDictItem } from '@/service/api/system-manage';
import { Api } from '@/typings/api';
import { computed, reactive, watch } from 'vue';


defineOptions({
  name: 'DictDataDrawer',
});
interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.SysDictData | null;
  id: number;
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

type Model = Pick<Api.SystemManage.SysDictData,'dictData' | 'dictDataName' | 'id' | 'sortNumber' | 'dictId'>;

const model = reactive(createDefaultModel());


function createDefaultModel(): Model {
  return {
    id: 0,
    dictId: props.id,
    dictDataName: '',
    dictData: '',
    sortNumber: 0
  };
}

type RuleKey = Exclude<keyof Model, 'id'>;

const rules: Record<RuleKey,App.Global.FormRule> = {
  dictDataName: defaultRequiredRule,
  dictData: defaultRequiredRule,
  sortNumber: defaultRequiredRule,
  dictId: defaultRequiredRule
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
    model.dictId = props.rowData.dictId;
    await updateDictItem(model.id, model);
    window.$message?.success($t('common.updateSuccess'));
  } else {
    console.log(props.id);
    model.dictId = props.id;
    await addDictItem(model);
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
        <NFormItem :label="$t('page.manage.dictdata.dictDataName')" path="dictDataName">
          <NInput v-model:value="model.dictDataName" :placeholder="$t('page.manage.dictdata.form.dictDataName')"/>
        </NFormItem>
        <NFormItem :label="$t('page.manage.dictdata.dictData')" path="dictData">
          <NInput v-model:value="model.dictData" :placeholder="$t('page.manage.dictdata.form.dictData')"/>
        </NFormItem>
        <NFormItem :label="$t('page.manage.dictdata.sortNumber')" path="sortNumber">
          <NInputNumber v-model:value="model.sortNumber" :placeholder="$t('page.manage.dictdata.form.sortNumber')"/>
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