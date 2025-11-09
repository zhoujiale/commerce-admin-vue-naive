<script setup lang="tsx">
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { Api } from '@/typings/api';
import { computed, reactive, ref, watch } from 'vue';
import  MsgTemplateEditor from './msgtemplate-editor.vue';
import { addMsgTemplate, getMsgTemplate, updateMsgTemplate } from '@/service/api/operation-manage';

defineOptions({
  name: 'MsgTemplateOperationModal'
});
export type OperateType = NaiveUI.TableOperateType;

interface Props {
  /** the type of operation */
  operateType: OperateType;
  id?: number | null;
}

const props = defineProps<Props>();

const editorRef = ref();
const content = ref('');

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
    add: $t('page.operation.msgtemplate.addTemplate'),
    edit: $t('page.operation.msgtemplate.editTemplate')
  };
  return titles[props.operateType];
});

const handleContentUpdate = (newContent: string) => {
  content.value = newContent;
}

const getContent = () => {
  content.value = editorRef.value.getContent();
}

type Model = Pick<
  Api.Operation.MsgTemplate,
  | 'templateName'
  | 'templateTitle'
  | 'templateContent'
> & {

};

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    templateName: '',
    templateTitle: '',
    templateContent: ''
  };
}

type RuleKey = Extract<keyof Model, 'templateName' | 'templateTitle' | 'templateContent'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  templateTitle: defaultRequiredRule,
  templateName: defaultRequiredRule,
  templateContent: defaultRequiredRule
};


async function handleInitModel(){
  if(!props.id) {
    Object.assign(model, createDefaultModel());
    return;
  }
  if(props.operateType === 'edit') {
    const { data: rest } = await getMsgTemplate(props.id);
    Object.assign(model, rest);
  }
}

function closeModal() {
  visible.value = false;
}

async function handleSubmit() {
  model.templateContent = content.value;
  await validate();
  if(props.operateType === 'edit' && props.id){
    const editResponse = await updateMsgTemplate(props.id,model);
    if(editResponse.response.data.code === 200) {
      window.$message?.success($t('common.updateSuccess'));
    }
  }else {
    const addResponse = await addMsgTemplate(model);
    if(addResponse.response.data.code === 200) {
      window.$message?.success($t('common.addSuccess'));
    }
  }
  closeModal();
  emit('submitted');
}

watch(visible,async () => {
  if (visible.value) {
    await handleInitModel();
    restoreValidation();
  }
});
</script>
<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-800px">
    <NScrollbar class="h-480px pr-20px">
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
        <NGrid ref="formRef" :model="model" responsive="screen" item-responsive>
         <NFormItemGi span="24 m:12" :label="$t('page.operation.msgtemplate.templateName')" path="templateName">
            <NInput v-model:value="model.templateName" :placeholder="$t('page.operation.msgtemplate.form.templateName')" />
         </NFormItemGi>
         <NFormItemGi span="24 m:12" :label="$t('page.operation.msgtemplate.templateTitle')" path="templateTitle">
            <NInput v-model:value="model.templateTitle" :placeholder="$t('page.operation.msgtemplate.form.templateTitle')" />
         </NFormItemGi>
         <NFormItemGi span="24 m:24" :label="$t('page.operation.msgtemplate.templateContent')" path="templateContent">
          <MsgTemplateEditor
            ref="editorRef"
            :content="model.templateContent"
            @update-content="handleContentUpdate"
          />
         </NFormItemGi>
        </NGrid>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{$t('common.cancel')}}</NButton>
        <NButton v-permission="'/msgTemplate/add || /msgTemplate/modify/{id}'" type="primary" @click="handleSubmit">{{$t('common.confirm')}}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>