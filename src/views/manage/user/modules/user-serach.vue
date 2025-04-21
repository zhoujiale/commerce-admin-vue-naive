<script setup lang="tsx">
import type { SelectOption, TreeSelectOption } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { fetchGetRoleList, getAllDepartmentList } from '@/service/api';
import { convertToSelectFormat } from '@/views/manage/role/modules/roleUtil';
import { convertToTreeSelectFormat } from '@/views/manage/department/modules/departmentUtil';

defineOptions({
  name: 'UserSearch'
});
const model = defineModel<Api.SystemManage.SystemUserSearchParams>('model', { required: true });
interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const userStatusOptions = [
  {
    label: '正常',
    value: 1
  },
  {
    label: '禁用',
    value: 2
  }
];

const roleIdOptions = ref<SelectOption[]>([]);

const departmentIdOptions = ref<TreeSelectOption[]>([]);

function reset() {
  emit('reset');
}

function search() {
  emit('search');
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
async function fetchGetAllDepartments() {
  const { data } = await getAllDepartmentList();
  if (data !== null && data.length > 0) {
    departmentIdOptions.value = convertToTreeSelectFormat(data);
  }
}
onMounted(() => {
  fetchGetAllRoles();
  fetchGetAllDepartments();
});
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['user-search']">
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.username')" path="username" class="pr-24px">
              <NInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.username')" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.realName')" path="realName" class="pr-24px">
              <NInput v-model:value="model.realName" :placeholder="$t('page.manage.user.form.realName')" clearable />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.user.userStatus')"
              path="userStatus"
              class="pr-24px"
            >
              <NSelect
                v-model:value="model.userStatus"
                :options="userStatusOptions"
                :placeholder="$t('page.manage.user.form.userStatus')"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.roleId')" path="roleId" class="pr-24px">
              <NSelect
                v-model:value="model.roleId"
                :options="roleIdOptions"
                :placeholder="$t('page.manage.user.form.roleId')"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.user.departmentId')"
              path="departmentId"
              class="pr-24px"
            >
              <NTreeSelect
                v-model:value="model.departmentId"
                :options="departmentIdOptions"
                :placeholder="$t('page.manage.user.form.departmentId')"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:16 m:12"
              :label="$t('page.manage.user.createDate')"
              path="createDate"
              class="pr-24px"
            >
              <NDatePicker
                v-model:value="model.timeRange"
                :placeholder="$t('page.manage.user.form.createDate')"
                type="datetimerange"
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
