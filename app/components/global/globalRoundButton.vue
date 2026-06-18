<script setup lang="ts">
const props = defineProps({
    animation: {
        type: String,
        required: false,
        default: 'arrow'
    }
})

const colors = useColors();

const animate = ref(false)

const playHoverAnimation = () => {
    if (animate.value) return;
    animate.value = true;

    setTimeout(() => {
        animate.value = false;
    }, 500)
}
</script>
<template>
    <div @pointerenter="playHoverAnimation" :class="[{animate}, animation]">
        <slot />
    </div>
</template>
<style lang="scss" scoped>
div {
    border-radius: 28px;

    &.animate {
        &.arrow {
            :deep(svg) {
                animation: global-link-svg-hover-animation .5s ease-in-out;
                animation-iteration-count: 1;
            }
        }
    }

    @media screen and (hover: hover) {
        &:hover {
            :deep(svg) {
                fill: $brown !important;
                //stroke: $brown !important;
            }
        }
    }
}

:deep(svg){
    position: relative;
    top: 0px;
    left: 0px;
}
</style>