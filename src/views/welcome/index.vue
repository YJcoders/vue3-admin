<template>
  <h1>admin {{ version }}</h1>
</template>

<script setup lang="ts">
const version = __APP_VERSION__;
defineOptions({
  name: "Welcome"
});
</script>
