<script setup lang="ts">
const props = defineProps<{
    link: string,
    color?: string
}>()

const animate = ref(false)

const playHoverAnimation = () => {
    if (animate.value) return;

    animate.value = true;

    setTimeout(()=>{
        animate.value = false;
    }, 500)
}

</script>
<template>
    <GlobalMenuLink @pointerenter="playHoverAnimation" :color="color" :link="link" class="main-link" :class="{ animate }">
        <slot />
    </GlobalMenuLink>
</template>
<style lang="scss" scoped>
.main-link{
    padding: .5rem 1rem;

    background-color: $white;
    color: $black;
    border-radius: 20px;
    display: inline-block;

    position: relative;
    overflow: hidden;

    &.router-link-active {
        text-decoration: underline;

        :deep(.text){
            text-decoration: underline;
        }
    }

    :deep(.text){
        position: relative;
        top: 0px;
        display: inline-block;
    }

    @media screen and (max-width: $small-breakpoint){
        background-color: transparent;
        color: $brown;
    }

    @media screen and (hover: hover) {
        &.animate
        {
            :deep(.text){
                animation: link-text-hover-animation .5s ease-in-out;
                animation-iteration-count: 1;
            }
        }
    }
}
</style>