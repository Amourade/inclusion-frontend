<script setup lang="ts">
const showTransitionScreen = ref(true);

onMounted(() => {
  showTransitionScreen.value = false;
})
</script>
<template>
  <div id="site-wrapper">
    <Transition name="page-transition">
      <div id="page-transition" v-if="showTransitionScreen" />
    </Transition>
    <GlobalHeader />
    <Transition mode="out-in" :duration="750" @before-leave="showTransitionScreen = true" @before-enter="showTransitionScreen = false">
      <NuxtPage />
    </Transition>
    <GlobalFooter />
  </div>
</template>
<style lang="scss" scoped>
#site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100lvh;
}

#page-transition {
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100dvw;
  height: 100dvh;
  opacity: 1;
  background: $blue;

  z-index: 20000;
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity .25s ease-in-out,  .5s ease-in-out, height .5s ease-in-out;
}

.page-transition-enter-from,
.page-transition-leave-to {
  width: 0dvw!important;
  height: 0dvh!important;
  opacity: 0!important;
}

.page-transition-enter-to,
.page-transition-leave-from {
  width: 100dvw!important;
  height: 100dvh!important;
  opacity: 1!important;
}
</style>
