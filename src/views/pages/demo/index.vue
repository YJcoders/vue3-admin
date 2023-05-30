<template>
  <div>
    <div>虚拟滚动</div>
    <virtual-list :list-data="listData" :item-height="itemHeight">
      <template #row="item">
        <div>{{ item.item.item.name }}</div>
      </template>
    </virtual-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import virtualList from "@/views/components/virtualList.vue";

const itemHeight = 20;
const listData = ref([]);
Array(100000)
  .fill(0)
  .forEach((item, index) => {
    listData.value.push({ name: index });
  });
</script>

<style lang="less" scoped></style>
