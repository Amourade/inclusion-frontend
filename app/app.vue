<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core';

const showTransitionScreen = ref(true);
const transitionIndex = ref(0);
const transitions = ['one', 'two', 'three', 'four']
let usedTransitions: number[] = []
const locale = useI18n();
const route = useRoute()

useHead({
  meta: [{ property: 'og:title', content: `${route.meta.title}` }],
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Projet Inclusion` : 'Projet Inclusion';
  }
})

const { x, y } = useWindowScroll({
  behavior: 'smooth'
})

onMounted(() => {
  showRandomTransition();

  showTransitionScreen.value = false;
})

const showRandomTransition = () => {
  let newTransition: number

  if(usedTransitions.length === 4) usedTransitions = [];

  do{
    newTransition = Math.floor(Math.random() * 4)
  }while(usedTransitions.includes(newTransition) || newTransition == transitionIndex.value)
  
  transitionIndex.value = newTransition
  usedTransitions.push(transitionIndex.value)

  showTransitionScreen.value = true
} 
</script>
<template>
  <div id="site-wrapper">
    <Transition name="page-transition">
      <div id="page-transition" :class="[transitions[transitionIndex]]" v-if="showTransitionScreen" />
    </Transition>
    <GlobalHeader />
    <Transition mode="out-in" :duration="750" @before-leave="showRandomTransition()" @before-enter="showTransitionScreen = false">
      <NuxtPage />
    </Transition>
    <GlobalFooter />
    <transition name="menu-fade" mode="out-in">
      <GlobalLien v-if="y > 200" 
        tabindex="0"
        :title="locale == 'fr' ? 'Défiler vers le haut' : 'Scroll to top'" 
        :aria-description="locale == 'fr' ? 'Défiler vers le haut' : 'Scroll to top'" 
        lien="#" id="go-up" class="no-text" 
        @click.prevent="y = 0" 
        :animation="'arrow-up'">
          <template #icon><SvgArrowScrollUp class="scroll-top-arrow" /></template>
      </GlobalLien>
    </transition>
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
  width: 100dvw;
  height: 100dvh;
  opacity: 1;
  background: $blue;

  z-index: 20000;

  &.one{
    left: 0px;
    bottom: 0px;
  }

  &.two{
    right: 0px;
    bottom: 0px;
  }

  &.three{
    left: 0px;
    top: 0px;
  }

  &.four{
    right: 0px;
    top: 0px;
  }
}
#go-up{
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;

  z-index: 10000;

  :deep(.icon){
    background: $very-light-orange!important;
  }

  :deep(svg){
    fill: $brown!important;
    stroke: $brown!important;
  }
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
