<script setup lang="ts">
import type { FormItemRule, FormRules } from 'naive-ui';
import { NForm, NFormItem, NModal } from 'naive-ui';
import { reactive, watch } from 'vue';
import { md5Encode } from '@/utils/md5';
import { updatePassword } from '@/service/api';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
defineOptions({
  name: 'UpdatePassword'
});
interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();
const visible = defineModel<boolean>('visible', {
  default: false
});
const { formRef, validate, restoreValidation } = useNaiveForm();
const model: Api.Auth.UpdatePassword = reactive(createDefaultModel());
const rules: FormRules = {
  password: [
    {
      required: true,
      validator(_rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入密码');
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{6,}$/.test(value)) {
          return new Error('密码必须包含大小写字母和数字的组合，可以使用特殊字符，长度大于等于6');
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ],
  confirmPassword: [
    {
      required: true,
      validator(_rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入确认密码');
        } else if (model.password !== value) {
          return new Error('两次密码输入不一致');
        }
        return true;
      },
      trigger: ['input', 'blur']
    }
  ]
};

function createDefaultModel() {
  return {
    password: '',
    confirmPassword: ''
  };
}
async function onUpdatePassword() {
  await validate();
  const params = {
    password: md5Encode(model.password),
    confirmPassword: md5Encode(model.confirmPassword)
  };
  const updateResponse = await updatePassword(params);
  if (updateResponse.response.data.code === 200) {
    window.$message?.success($t('common.updateSuccess'));
  }
  closeDrawer();
  emit('submitted');
}
function closeDrawer() {
  visible.value = false;
}
watch(visible, () => {
  if (visible.value) {
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" preset="card" class="w-400px" title="更新密码">
    <NForm ref="formRef" label-placement="left" :model="model" :rules="rules">
      <NFormItem label="密码" path="password" required>
        <NInput v-model:value="model.password" type="password" show-password-on="mousedown" />
      </NFormItem>
      <NFormItem label="确认密码" path="confirmPassword" required>
        <NInput v-model:value="model.confirmPassword" type="password" show-password-on="mousedown" />
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="onUpdatePassword">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped>
.update-button {
  display: flex;
  justify-content: end;
}
</style>
