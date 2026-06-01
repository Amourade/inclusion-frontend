<script setup lang="ts">
import { onClickOutside, useBreakpoints, useMouseInElement, usePointer } from '@vueuse/core';

const props = defineProps<{
    link: MenuItem
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

const activeLinks = ref(0);

const setActiveState = (active: boolean) => {
    if (active) activeLinks.value++
    else activeLinks.value--
}

watch(activeBreakpoint, () => {
    showSubmenu.value = false
})
</script>
<template>
    <li class="main-menu-item" ref="linkRef" @pointerenter="triggerSubmenu('hover', true)"
        @pointerleave="triggerSubmenu('hover', false)" @click.prevent="triggerSubmenu('click', !showSubmenu)">
        <GlobalMainMenuLink :link="link.lien" @click="() => {
            if (!link.sous_menu) emits('closeMenu')
        }" :class="{ open: showSubmenu, 'submenu': link.sous_menu, 'submenu-active': link.sous_menu && Math.abs(activeLinks) < link.sous_menu.length }">
            <span>{{ link.libelle }}</span>
            <SvgDownArrow v-if="link.sous_menu" class="menu-arrow"
                :color="activeBreakpoint == 'small' ? colors.brown : colors.black" />
        </GlobalMainMenuLink>
        <template v-if="link.sous_menu">
            <ul class="sub-menu" v-show="showSubmenu">
                <li v-for="subLink in link.sous_menu" :key="subLink.id">
                    <GlobalMenuLink @active="setActiveState" :link="subLink.lien" @click="emits('closeMenu')">{{ subLink.libelle }}</GlobalMenuLink>
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

.router-link-active{
    border-color: black;

    &.submenu{
        border-color: transparent;
        
        &.submenu-active {
            border-color: black;
        }
    }
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