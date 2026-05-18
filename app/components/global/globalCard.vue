<script setup lang="ts">
const props = defineProps<{
    smallTitle?: string;
    largeText?: string;
}>();
</script>
<template>
    <div class="global-card">
        <h2 v-if="smallTitle">{{ smallTitle }}</h2>
        <p v-if="largeText" class="large-text">{{ largeText }}</p>
        <slot />
    </div>
</template>
<style lang="scss" scoped>
.global-card {
    background-color: $light-grey;
    color: $brown;

    font-family: 'inter', sans-serif;

    border-radius: $cards-radius;
    padding: $cards-padding;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;

    position: relative;
    z-index: 1;
}

h2{
  font-size: 1.1rem;
  line-height: 120%;
  font-weight: 400;

  margin-bottom: 0rem;
  margin-top: 3rem;
}

p{
  font-size: 2rem;
  line-height: 112%;

  margin-bottom: 1rem;

    @media screen and (max-width: $medium-breakpoint) {
        font-size: 1.75rem;
    }

    @media screen and (max-width: $small-breakpoint) {
        font-size: 1.5rem;
    }
}
</style>