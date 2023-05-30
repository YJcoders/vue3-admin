<template>
  <div ref="virtualList" class="container" @scroll="onScroll">
    <div ref="support" class="support" :style="{ height: totalHeight }" />
    <div ref="content" class="content">
      <div
        ref="item"
        v-for="item in showData"
        :id="item._index"
        :key="item._index"
        class="list"
        :style="{ lineHeight: itemHeight + 'px' }"
      >
        <slot name="row" :item="item">
          <span>{{ item.item.name }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface List {
  name: string | number;
  [propName: string]: any;
}
const props = defineProps({
  // 列表数据
  listData: {
    type: Array,
    default: () => []
  },
  // 初始单个item高度
  itemHeight: {
    type: Number,
    required: true
  }
});

// 可视区域只展示截取的部分数据
// 监听滚动事件，动态改变可视区域数据，改变偏移量
// scrollTop: 滚动高度 startIndex: 起始索引 endIndex: 结束索引 itemHeight: item高度
// viewHeight: 可视区域高度 = clientHeight
// startIndex = Math.floor(scrollTop / itemHeight) // 可是区域起始索引
// endIndex = startIndex + Math.ceil(viewHeight / itemHeight) // 可是区域结束索引
const viewHeight = ref(0);
const startIndex = ref(0);
const endIndex = ref(0);

const _listData = computed(() => {
  return props.listData.map((item: List, index) => {
    return {
      _index: `_${index}`,
      item
    };
  });
});
const showData = computed(() =>
  _listData.value.slice(startIndex.value, endIndex.value)
);
const totalHeight = computed(
  () => `${props.itemHeight * props.listData.length}px`
);
// this.initPosition();

const virtualList = ref();
const content = ref();
onMounted(() => {
  viewHeight.value = virtualList.value.clientHeight;
  startIndex.value = 0;
  endIndex.value =
    startIndex.value + Math.ceil(viewHeight.value / props.itemHeight);
});

const onScroll = () => {
  const scrollTop = virtualList.value.scrollTop;
  startIndex.value = Math.floor(scrollTop / props.itemHeight);
  endIndex.value =
    startIndex.value + Math.ceil(viewHeight.value / props.itemHeight);
  // 设置偏移量
  const startOffset = scrollTop - (scrollTop % props.itemHeight);
  content.value.style.transform = `translate3d(0,${startOffset}px,0)`;
};
</script>

<style lang="scss" scoped>
.container {
  width: 200px;
  height: 300px;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.support {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.content {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
}

.item {
  padding: 5px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
  /* height:200px; */
}
</style>
