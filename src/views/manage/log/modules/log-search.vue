<script setup lang="tsx">
import type { TreeSelectOption } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { getAllDepartmentList } from '@/service/api';
import { convertToTreeSelectFormat } from '../../department/modules/departmentUtil';

defineOptions({
  name: 'LogSearch'
});
const model = defineModel<Api.SystemManage.SystemLogSearchParams>('model', { required: true });
interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}
const emit = defineEmits<Emits>();
const departmentIdOptions = ref<TreeSelectOption[]>([]);

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}

async function fetchGetAllDepartments() {
  const { data } = await getAllDepartmentList();
  if (data !== null && data.length > 0) {
    departmentIdOptions.value = convertToTreeSelectFormat(data);
  }
}
onMounted(() => {
  fetchGetAllDepartments();
});
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['log-search']">
      <NCollapseItem :title="$t('common.search')" name="log-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.log.username')" path="username" class="pr-24px">
              <NInput v-model:value="model.username" :placeholder="$t('page.manage.log.form.username')" clearable />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.log.departmentName')"
              path="departmentId"
              class="pr-24px"
            >
              <NTreeSelect
                v-model:value="model.departmentId"
                :options="departmentIdOptions"
                :placeholder="$t('page.manage.log.form.departmentId')"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:16 m:12"
              :label="$t('page.manage.log.createDate')"
              path="createDate"
              class="pr-24px"
            >
              <NDatePicker :placeholder="$t('page.manage.log.form.createDate')" type="datetimerange" clearable />
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
