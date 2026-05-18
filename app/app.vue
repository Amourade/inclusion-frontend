<script setup lang="ts">
</script>
<template>
  <div id="site-wrapper">
    <GlobalHeader />
    <NuxtPage />
    <GlobalFooter />
  </div>
</template>
<style lang="scss" scoped>
#site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100lvh;
}
</style>
