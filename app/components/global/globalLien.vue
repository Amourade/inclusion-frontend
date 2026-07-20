<script setup lang="ts">
const props = defineProps({
    lien: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    animation: {
        type: String,
        required: false,
        default: 'arrow'
    }
})

const colors = useColors();

const parsedLink = useParseLink(props.lien)

const animate = ref(false)

const playHoverAnimation = () => {
    if (animate.value) return;
    animate.value = true;

    setTimeout(() => {
        animate.value = false;
    }, 500)
}

const cancelClickIfNoDestination = (e: PointerEvent) => {
    if (parsedLink.value == '#') { 
        e.preventDefault() 
    }
}
</script>
<template>
    <template v-if="typeof parsedLink == 'string' && parsedLink.startsWith('#')">
        <a @click="cancelClickIfNoDestination" :href="parsedLink" @pointerenter="playHoverAnimation" :class="[{ animate }, animation]">
            <span class="icon" :style="{ backgroundColor: color ? color : colors.brown }">
                <slot name="icon" />
            </span>
            <slot name="text" />
        </a>
    </template>
    <template v-else>
        <NuxtLink :to="parsedLink" :external="typeof parsedLink == 'string'" :target="typeof parsedLink == 'string' ? '_blank' : '_self'"  @pointerenter="playHoverAnimation" :class="[{ animate }, animation]">
            <span class="icon" :style="{ backgroundColor: color ? color : colors.brown }">
                <slot name="icon" />
            </span>
            <slot name="text" />
        </NuxtLink>
    </template>
</template>
<style lang="scss" scoped>
a {
    font-size: .875rem;

    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .75rem;

    position: relative;

    &.animate {
        &.arrow {
            :deep(svg) {
                animation: global-link-svg-hover-animation .5s ease-in-out;
                animation-iteration-count: 1;
            }
        }
        &.arrow-up {
            :deep(svg) {
                animation: scroll-top-link-svg-hover-animation .5s ease-in-out;
                animation-iteration-count: 1;
            }
        }
    }

    &:not(.no-text)::before {
        content: "";
        background-color: $brown;
        width: 100%;
        bottom: 0px;
        width: 0%;
        height: 1px;
        position: absolute;

        transition: width .5s ease-in-out;
    }

    @media screen and (hover: hover) {
        &:hover {
            &::before {
                width: 100%;
            }

            .icon {
                background-color: $orange !important;

                :deep(svg) {
                    fill: $brown !important;
                    stroke: $brown !important;
                }
            }
        }
    }

    @media screen and (max-width: $medium-breakpoint) {
        font-size: 1rem;
    }

    @media screen and (max-width: $small-breakpoint) {
        font-size: 1rem;
    }
}

.icon {
    display: inline-flex;
    background-color: $brown;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    width: 2rem;
    height: 2rem;

    transition: background-color .5s ease-in-out, color .5s ease-in-out;

    :deep(svg) {
        width: .75rem;
        height: .75rem;

        position: relative;
        top: 0px;
        left: 0px;

        @media screen and (max-width: $medium-breakpoint) {
            font-size: 1rem;
        }

        @media screen and (max-width: $small-breakpoint) {
            font-size: 1rem;
        }
    }
}
</style>