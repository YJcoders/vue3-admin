<template>
  <div>
    <div>父组件传递的值count: {{ count }}</div>
    <div>父组件传递的值data.number: {{ data.number }}</div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from "vue";
const props = defineProps({
  obj: {
    type: Object
  }
});

// 使用解构，原有的基础数据类型值会丢失响应式，引用数据类型不会丢失
// const { count, data } = props.obj;
// 使用toRefs 添加响应式
const { count, data } = toRefs(props.obj);
</script>

<style lang="less" scoped></style>
