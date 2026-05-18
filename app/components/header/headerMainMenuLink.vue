<script setup lang="ts">
import { onClickOutside, useBreakpoints, useMouseInElement, usePointer } from '@vueuse/core';

const props = defineProps<{
    link: MainMenuLink
}>()
const emits = defineEmits<{
    (e: 'closeMenu'): void
}>()

const linkRef = useTemplateRef('linkRef');
const colors = useColors();
const breakPointsValues = useBreakpointsValues()
const { pointerType } = usePointer();
const breakpoints = useBreakpoints(breakPointsValues.value);
const activeBreakpoint = breakpoints.active();
const showSubmenu = ref(false);

onClickOutside(linkRef, () => closeSubmenuOnClickOutside())
const triggerSubmenu = (type: 'hover' | 'click', state: boolean) => {
    if (type === 'hover' && pointerType.value === 'mouse') {
        if (activeBreakpoint.value !== 'small') showSubmenu.value = state
    }
    if (type === 'click') {
        showSubmenu.value = state
    }
}

const closeSubmenuOnClickOutside = () => {
    if (activeBreakpoint.value !== 'small')
        showSubmenu.value = false
}

watch(activeBreakpoint, () => {
    showSubmenu.value = false
})
</script>
<template>
    <li class="main-menu-item" ref="linkRef" @pointerenter="triggerSubmenu('hover', true)"
        @pointerleave="triggerSubmenu('hover', false)" @click.prevent="triggerSubmenu('click', !showSubmenu)">
        <template v-if="link.link && link.link !== '#'">
            <GlobalMainMenuLink :to="{ name: link.link }" @click="() => {
                if (!link.submenu) emits('closeMenu')
            }" :class="{ open: showSubmenu }">
                <span>{{ link.label }}</span>
                <SvgDownArrow v-if="link.submenu" class="menu-arrow"
                    :color="activeBreakpoint == 'small' ? colors.brown : colors.black" />
            </GlobalMainMenuLink>
        </template>
        <template v-else>
            <GlobalMainMenuLink href="#" @click="() => {
                if (!link.submenu) emits('closeMenu')
            }" :class="{ open: showSubmenu }">
                <span>{{ link.label }}</span>
                <SvgDownArrow v-if="link.submenu" class="menu-arrow"
                    :color="activeBreakpoint == 'small' ? colors.brown : colors.black" />
            </GlobalMainMenuLink>
        </template>
        <template v-if="link.submenu">
            <ul class="sub-menu" v-show="showSubmenu">
                <li v-for="subLink in link.submenu">
                    <NuxtLink :to="{ name: subLink.link }" @click="emits('closeMenu')">{{ subLink.label }}</NuxtLink>
                </li>
            </ul>
        </template>
    </li>
</template>
<style lang="scss" scoped>
li {
    position: relative;

    flex-shrink: 0;
    width: max-content;
}

.router-link-active {
    border-color: black;
}

.sub-menu {
    background-color: $light-grey;
    color: $brown;

    width: max-content;
    padding: 1rem;
    border-radius: 20px;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    position: absolute;

    top: 100%;
    left: 0%;

    z-index: 10;
    //transform: translateX(-50%);

    li {
        color: $brown;
        font-size: 1rem;
        font-family: "inter", sans-serif;
        font-weight: 400;
        line-height: 100%;

        a {
            padding: .5rem 0;

            &.router-link-active {
                text-decoration: underline;
            }
        }
    }

    @media screen and (max-width: $small-breakpoint) {
        position: relative;
        transform: none;
        padding: .5rem;
        padding-right: 1.5rem;
        margin-left: .25rem;

        align-items: flex-end;
    }
}

.open {
    .menu-arrow {
        transform: rotate(180deg);
    }
}

.menu-arrow {
    width: .75rem;
    height: .75rem;
    flex-shrink: 0;
}
</style>