<template>
  <div>
    <h4>方案1: 滚动 + 计算位置 + dataset</h4>

    <div>
      <img class="img-demo" data-src="./images/1.jpeg" alt="" />
      <img class="img-demo" data-src="./images/2.jpeg" alt="" />
      <img class="img-demo" data-src="./images/3.jpeg" alt="" />
      <img class="img-demo" data-src="./images/4.jpeg" alt="" />
      <img class="img-demo" data-src="./images/5.jpeg" alt="" />
      <img class="img-demo" data-src="./images/6.jpeg" alt="" />
      <img class="img-demo" data-src="./images/7.jpeg" alt="" />
      <img class="img-demo" data-src="./images/8.jpeg" alt="" />
      <img class="img-demo" data-src="./images/9.jpeg" alt="" />
      <img class="img-demo" data-src="./images/10.jpeg" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useAppStoreHook } from "@/store/modules/app";

const { $state } = useAppStoreHook();
watch(
  () => $state.scrollInfo,
  () => {
    lazyLoad();
  }
);
const lazyLoad = () => {
  const imgs = document.getElementsByClassName("img-demo");
  const imgList = ref([]);
  imgList.value = Array.from(imgs);
  const clientHeight = document.documentElement.clientHeight;
  // 滚动的距离
  const scrollTop = $state.scrollInfo.scrollTop;
  imgList.value.forEach(item => {
    // const offsetTop = item.offsetTop;
    const offsetTop = item.getBoundingClientRect().top;
    const url = new URL(item.dataset.src, import.meta.url).href;
    // 此处可用缺省图 替换 优化展示效果
    if (offsetTop < clientHeight + scrollTop + 500 && !item.src && url) {
      item.src = url;
    }
  });
};
onMounted(() => {
  lazyLoad();
});
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 400px;
  margin-bottom: 10px;
}
</style>
