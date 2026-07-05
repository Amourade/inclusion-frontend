<script setup lang="ts">
import { useMouse, useImage, useWindowSize } from '@vueuse/core'
const props = defineProps({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false,
        default: ""
   },
   showDescription: {
        type: Boolean,
        required: false,
        default: false
   },
   cover: {
    type: Boolean,
    required: false,
    default: true
   }
})

const { isReady } = useImage({ src: props.image })
const { x, y } = useMouse();
const {width} = useWindowSize();
const imageHover = ref(false);

const titlePositionStyle = computed(()=>{
    return {
        left: `${x.value + 10}px`,
        top: `${y.value - window.scrollY + 10}px`
    }
})
</script>
<template>
    <div class="loading-image" :class="{showDescription, cover}">
        <Transition name="fade">
            <div v-if="!isReady" class="loading-svg-holder">
                <SvgAccueilHero />
            </div>
        </Transition>
        <img @mouseleave="imageHover = false" :class="{ready: isReady}" :src="image" :alt="title ? title : 'Projet Inclusion'" loading="lazy" />
    </div>
</template>
<style lang="scss" scoped>
.loading-image{
    position: relative;
    width: 100%;
    height: 100%;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    color: $brown;

    &.cover{
        background: $very-light-orange;
    }
}
svg{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    object-fit: cover;
    width:  min(50%, 100px);
    height: min(50%, 100px);

    z-index: 10;
}
.cover img{
    object-fit: cover;
}
img{
    position: absolute;
    object-fit: contain;
    
    width: 100%;
    height: 100%;

    opacity: 0;

    transition: opacity 1s linear;

    &.ready{
        opacity: 1;
    }
}

.title{
    color: var(--main-green);
    overflow: hidden;

    white-space: nowrap;

    position: fixed;

    z-index: 105;
}
</style>