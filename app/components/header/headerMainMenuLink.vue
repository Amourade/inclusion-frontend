<script setup lang="ts">
import { onClickOutside, useBreakpoints, useMouseInElement, usePointer } from '@vueuse/core';
import { useIntervalFn } from '@vueuse/core'

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
const submenuHasActiveLinks = ref(false)
const submenuRef = useTemplateRef('submenuRef');
const { pause, resume, isActive } = useIntervalFn(() => {
    const children = submenuRef.value?.children

    if(!children?.length) return;
    let activeChildren = 0;

    for(let i = 0; i < children.length; i++){
        const link = children[i]?.getElementsByTagName('a')[0];
        if(link?.classList.contains('router-link-exact-active')) activeChildren++;
    }
    
    activeChildren > 0 ? submenuHasActiveLinks.value = true : submenuHasActiveLinks.value = false;
}, 250, {
    immediate: false
})

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

onMounted(() => {
    if(props.link.sous_menu){
        resume();
    }
})
</script>
<template>
    <li class="main-menu-item" ref="linkRef" @pointerenter="triggerSubmenu('hover', true)"
        @pointerleave="triggerSubmenu('hover', false)" @click.prevent="triggerSubmenu('click', !showSubmenu)">
        <GlobalMainMenuLink :link="link.lien" @click="() => {
            if (!link.sous_menu) emits('closeMenu')
        }" :class="{ open: showSubmenu, 'submenu': link.sous_menu, 'submenu-active': link.sous_menu && submenuHasActiveLinks }">
            <span class="text">{{ link.libelle }}</span>
            <SvgDownArrow v-if="link.sous_menu" class="menu-arrow"
                :color="activeBreakpoint == 'small' ? colors.brown : colors.black" />
        </GlobalMainMenuLink>
        <template v-if="link.sous_menu">
            <transition name="submenu-fade">
                <ul class="sub-menu" v-show="showSubmenu" ref="submenuRef">
                    <li v-for="subLink in link.sous_menu" :key="subLink.id">
                        <GlobalSubMenuLink :link="subLink.lien" @click="emits('closeMenu')"><span class="text">{{ subLink.libelle }}</span></GlobalSubMenuLink>
                    </li>
                </ul>
            </transition>
        </template>
    </li>
</template>
<style lang="scss" scoped>
li {
    position: relative;

    flex-shrink: 0;
    width: max-content;
}

.sub-menu {
    //background-color: $light-grey;
    //color: $brown;

    width: max-content;
    padding: .5rem 0rem;

    display: flex;
    flex-direction: column;
    gap: .5rem;

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
        line-height: 1;
    }

    @media screen and (max-width: $small-breakpoint) {
        position: relative;
        transform: none;
        padding: .5rem;
        padding-right: 1.5rem;
        margin-left: .25rem;
        gap: 0rem;

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
    transition: transform .5s ease-in-out;
}
</style>