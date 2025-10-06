<script setup lang="ts">
import { $t } from '@/locales';
import { Api } from '@/typings/api';
defineOptions({
  name: 'DictDataSearch',
});
const model = defineModel<Api.SystemManage.SysDictDataSearchParams>('model',{ required: true});

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
    <NCollapse :default-expanded-names="['dictdata-search']">
      <NCollapseItem :title="$t('common.search')" name="dictdata-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.dictdata.dictDataName')"
              path="dictDataName"
              class="pr-24px"
            >
              <NInput
                v-model:value="model.dictDataName"
                :placeholder="$t('page.manage.dictdata.form.dictDataName')"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:18">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon"/>
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon"/>
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