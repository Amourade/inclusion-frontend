<script setup lang="ts">
const props = defineProps<{
    link: string,
    color?: string
}>()

const animate = ref(false)

const playHoverAnimation = (e: PointerEvent) => {
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
    color: $black;
    font-size: 1rem;
    font-family: "inter", sans-serif;
    font-weight: 400;
    line-height: 100%;
    

    white-space: nowrap;
    border: 1px solid transparent;
    border-radius: 20px;

    display: inline-block;

    display: flex;
    align-items: center;
    flex-shrink: 0;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: .3rem;

    padding: .5rem .5rem;

    transition: border-color 0.5s ease-in-out, background-color .5s ease-in-out, color .5s ease-in-out;

    overflow: hidden;

    &:not(.top-link){
        &.router-link-active {
            border-color: $black;

            @media screen and (max-width: $small-breakpoint){
                border-color: $brown;
            }

            &.submenu {
                border-color: transparent;

                @media screen and (hover: hover) {
                    &:hover, &.open {
                        border-color: $black;

                        @media screen and (max-width: $small-breakpoint){
                            border-color: $brown;
                        }
                    }
                }
                
                &.submenu-active {
                    border-color: $black;

                    @media screen and (max-width: $small-breakpoint){
                        border-color: $brown;
                    }
                }
            }
        }
    }
        
    &.top-link{
        background-color: $brown;
        color: $orange;
        padding-left: 1rem;
        padding-right: 1rem;

        :deep(svg) {
            width: .75rem;
            height: .75rem;
            flex-shrink: 0;
            rotate: 225deg;

            position: relative;
            top: 0px;
            left: 0px;
        }

        &.router-link-active:not(.external) {
            border-color: transparent;
            background-color: $orange;
            color: $brown;
        }
    }

    :deep(.text){
        position: relative;
        top: 0px;
    }

    @media screen and (hover: hover) {
        &:not(.top-link){
            &:hover {
                border-color: $black;

                @media screen and (max-width: $small-breakpoint){
                    border-color: $brown;
                }
            }
        }

        &.top-link{
            &:hover{
                border-color: transparent;
                background-color: $orange;
                color: $brown;

                :deep(svg){
                    fill: $brown!important;
                }
            }
        }

        &.animate
        {
            :deep(.text){
                animation: link-text-hover-animation .5s ease-in-out;
                animation-iteration-count: 1;
            }

            &.top-link{
                :deep(svg){
                    animation: top-link-svg-hover-animation .5s ease-in-out;
                    animation-iteration-count: 1;
                }
            }
        }
    }

    @media screen and (max-width: $small-breakpoint) {
        color: $brown;
    }
}
</style>