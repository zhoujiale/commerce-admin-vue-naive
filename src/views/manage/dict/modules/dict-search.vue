<script setup lang="ts">
import { $t } from '@/locales';
import { Api } from '@/typings/api';

defineOptions({
  name: 'DictSearch'
});
const model = defineModel<Api.SystemManage.SysDictSearchParams>('model', { required: true });

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['dict-search']">
      <NCollapseItem :title="$t('common.search')" name="dict-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.dict.dictName')"
              path="dictName"
              class="pr-24px"
            >
              <NInput
                v-model:value="model.dictName"
                :placeholder="$t('page.manage.dict.form.dictName')"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.dict.dictKey')"
              path="dictKey"
              class="pr-24px"
            >
              <NInput
                v-model:value="model.dictKey"
                :placeholder="$t('page.manage.dict.form.dictKey')"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:18">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>
