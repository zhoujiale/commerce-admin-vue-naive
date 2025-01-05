<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import type { TreeOption } from 'naive-ui';
import { menuTreeList } from '@/service/api/system-manage';
import { convertToTreeSelectFormat } from './menuUtil';

defineOptions({
  name: 'MenuTree'
});
const menuTree = ref<TreeOption[]>([]);
const defaultExpandedKeys = ref<number[]>([]);
const emit = defineEmits(['getMenuIdList']);
async function fetchMenuTreeList() {
  const treeResponse = await menuTreeList();
  if (treeResponse.error === null) {
    const data = treeResponse.data;
    console.log(data);
    data.forEach((value, _index, _array) => {
      defaultExpandedKeys.value.push(value.id);
    });
    menuTree.value = convertToTreeSelectFormat(data);
    console.log(menuTree.value);
  }
}
function updateCheckedKeys(keys: Array<number>) {
  emit('getMenuIdList', keys);
}

onMounted(() => {
  fetchMenuTreeList();
});
</script>

<template>
  <NTree
    :block-line="true"
    :cascade="true"
    :checkable="true"
    :selectable="false"
    :expand-on-click="true"
    :data="menuTree"
    :default-expanded-keys="defaultExpandedKeys"
    @update:checked-keys="updateCheckedKeys"
  />
</template>
