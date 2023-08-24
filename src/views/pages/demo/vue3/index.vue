<template>
  <div>
    <div class="parent">
      父组件
      <div>count: {{ count }}</div>
      <div>obj.count: {{ obj.count }}</div>
      <div>obj.data.number: {{ obj.data.number }}</div>
      <div>obj.data.o.num: {{ obj.data.o.num }}</div>
      <child class="child" :obj="obj">子组件</child>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRef, toRefs, onBeforeUnmount } from "vue";
import child from "./components/child.vue";

const obj = ref({
  count: 0,
  num: 0,
  data: {
    o: {
      num: 1
    },
    number: 0
  }
});

// 解构赋值，基础数据类型是按值传递，会丢失响应式
// 引用数据类型是，按引用传递，保留响应式
const { count, data } = obj.value;
// 使用toRefs 转为响应式
// const { count, data } = toRefs(obj.value);
// let timer = setInterval(() => {
//   // count++;
//   // obj.value.count++;
//   obj.value.data.o.num++;
//   // data.value.number++;
//   // console.log(obj.value.count);
// }, 1000);

onBeforeUnmount(() => {
  // clearInterval(timer);
  // timer = null;
});
</script>

<style lang="scss" scoped>
.parent,
.child {
  border: 1px solid #bbb;
  border-radius: 4px;
  padding: 10px;
}
.child {
  width: 300px;
  height: 200px;
  margin: 20px;
}
</style>
