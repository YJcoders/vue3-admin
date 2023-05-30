<template>
  <div>
    <h4>方案2: 新api: IntersectionObserver + dataset</h4>

    <div>
      <img class="img-demo" src="" data-src="./images/1.jpeg" alt="" />
      <img class="img-demo" src="" data-src="./images/2.jpeg" alt="" />
      <img class="img-demo" src="" data-src="./images/3.jpeg" alt="" />
      <img class="img-demo" src="" data-src="./images/4.jpeg" alt="" />
      <img class="img-demo" src="" data-src="./images/5.jpeg" alt="" />
      <img class="img-demo" src="" data-src="./images/6.jpeg" alt="" />
      <img class="img-demo" src="" data-src="./images/7.jpeg" alt="" />
      <img class="img-demo" src="" data-src="./images/8.jpeg" alt="" />
      <img class="img-demo" src="" data-src="./images/9.jpeg" alt="" />
      <img class="img-demo" src="" data-src="./images/10.jpeg" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 新api  IntersectionObserver
const observer = new IntersectionObserver((entries, observer) => {
  console.log(entries);
  entries.forEach(item => {
    console.log(item);
    // 判断是否可见
    if (item.isIntersecting) {
      item.target.src = new URL(
        item.target.getAttribute("data-src"),
        import.meta.url
      ).href;
      // 资源加载后，停止进行观察
      observer.unobserve(item.target);
    }
  });
});
onMounted(() => {
  const imgs = document.getElementsByClassName("img-demo");
  const imgList = ref([]);
  imgList.value = Array.from(imgs);
  imgList.value.forEach(img => observer.observe(img));
});
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 400px;
  margin-bottom: 10px;
}
</style>
