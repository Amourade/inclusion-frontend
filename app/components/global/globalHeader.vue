<script lang="ts" setup>
import { onClickOutside, useBreakpoints } from '@vueuse/core';

const { locale, setLocale } = useI18n();
const { getSingletonItem, getItems } = useDirectusItems();
const colors = useColors();
const breakPointsValues = useBreakpointsValues()
const breakpoints = useBreakpoints(breakPointsValues.value);
const activeBreakpoint = breakpoints.active();
const menuRef = useTemplateRef('menuRef');
const showMenu = ref(false);

const toggleMenu = () => {
    showMenu.value = !showMenu.value;
}

onClickOutside(menuRef, () => {
    if (activeBreakpoint.value == 'small')
        showMenu.value = false
})

const {
    data: lienMenuDataRaw,
    pending: lienMenuDataPending,
    error: lienMenuDataError,
    refresh: lienMenuDataRefresh,
} = await useAsyncData("menu_items", () =>
    getItems<MenuItem>({
        collection: "lien_menu",
        params: {
            fields: ["*", "translations.*"]
        }
    })
);
const lienMenuData = useTranslatedItems(lienMenuDataRaw, locale);

const {
    data: lienMenuDessusDataRaw,
    pending: lienMenuDessusPending,
    error: lienMenuDessusError,
    refresh: lienMenuDessusRefresh,
} = await useAsyncData("menu_items_top", () =>
    getItems<MenuItem>({
        collection: "lien_menu_haut",
        params: {
            fields: ["*", "translations.*"]
        }
    })
);
const lienMenuDessusData = useTranslatedItems(lienMenuDessusDataRaw, locale);
</script>
<template>
    <header id="header">
        <div id="logo">
            <h1>
                <NuxtLink :to="{ name: 'index' }">
                    <SvgMainLogo />
                </NuxtLink>
            </h1>
        </div>
        <nav id="menu" ref="menuRef">
            <button id="menu-button" :class="{ 'open': showMenu }" v-if="activeBreakpoint == 'small'"
                @click.prevent="toggleMenu">
                <span>Menu</span>
                <SvgDownArrow class="menu-arrow" :color="colors['orange']" />
            </button>
            <div id="inner-menu" v-show="activeBreakpoint == 'small' && showMenu || activeBreakpoint != 'small'">
                <ul>
                    <HeaderMainMenuLink v-for="item in lienMenuData" :key="item.id" :link="item"
                        @closeMenu="showMenu = false" />
                    <li v-if="locale !== 'en'">
                        <GlobalMainMenuLink link="#" @click.prevent="setLocale('en'); showMenu = false"><span>en</span></GlobalMainMenuLink>
                    </li>
                    <li v-if="locale !== 'fr'">
                        <GlobalMainMenuLink link="#" @click.prevent="setLocale('fr'); showMenu = false"><span>fr</span></GlobalMainMenuLink>
                    </li>
                </ul>
                <ul class="other-buttons" v-if="lienMenuDessusData && lienMenuDessusData.length > 0">
                    <li v-for="item in lienMenuDessusData" :key="item.id">
                        <GlobalMainMenuLink :color="colors.orange" :link="item.lien" class="agenda-link"
                            @click="showMenu = false">
                            <span>{{ item.libelle }}</span>
                        </GlobalMainMenuLink>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>
<style lang="scss" scoped>
header {
    //background-color: $white;
    width: 100%;

    max-width: $large-breakpoint;
    margin: 0 auto;

    padding: $content-block-padding-large;
    padding-right: 30px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    gap: 2rem .5rem;

    @media screen and (max-width: $medium-breakpoint) {
        padding: $content-block-padding-medium;
    }

    @media screen and (max-width: $small-breakpoint) {
        padding: $content-block-padding-small;
        flex-wrap: nowrap;
    }
}

#menu-button {
    background: $brown;
    color: $orange;
    border: none;
    outline: none;
    border-radius: 20px;

    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: .3rem;

    font-size: 1rem;
    font-family: "inter", sans-serif;
    font-weight: 400;
    line-height: 100%;

    padding: .5rem 1rem;

    z-index: 10;
    position: relative;

    cursor: pointer;

    svg {
        width: .75rem;
        height: .75rem;
        flex-shrink: 0;
        //rotate: 225deg;
    }

    &.open {
        svg {
            rotate: 180deg;
        }
    }
}

#logo {
    flex-shrink: 0;
}

#menu {
    //margin: 0 auto;
    position: relative;

    @media screen and (max-width: $small-breakpoint) {
        /* position: absolute;
        width: 100%;
        right: 0%; */
        margin: 0;
    }
}

#inner-menu {
    display: flex;
    flex-direction: column-reverse;
    gap: .75rem;

    align-items: flex-end;
    justify-content: flex-end;

    position: relative;

    z-index: 30;

    @media screen and (max-width: $small-breakpoint) {
        position: absolute;
        top: calc(100% + .5rem);
        right: 0px;

        //width: calc(100vw - 50px);

        flex-direction: column;
        background-color: $light-grey;

        padding: 1rem;
        border-radius: 20px;

        li {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
        }
    }
}

#menu ul {
    display: flex;
    flex-direction: row;
    gap: .1rem;
    flex-wrap: wrap;
    justify-content: flex-end;

    margin: 0 auto;

    li {
        flex-shrink: 0;
        width: max-content;
    }

    &.other-buttons {
        display: flex;
        flex-direction: row;
        gap: 1rem;

        justify-content: flex-end;
        margin: 0;

        li {
            a {
                background-color: $brown;
                color: $orange;
                padding-left: 1rem;
                padding-right: 1rem;
            }

            svg {
                width: .75rem;
                height: .75rem;
                flex-shrink: 0;
                rotate: 225deg;
            }

            @media screen and (hover: hover) {
                &:hover {
                    border-color: transparent;
                }
            }
        }

        @media screen and (max-width: $small-breakpoint) {
            flex-direction: column;
            align-items: flex-end;
        }
    }

    @media screen and (max-width: $small-breakpoint) {
        flex-direction: column;
        width: 100%;

        align-items: flex-end;

        li {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            width: 100%;
        }
    }
}
</style>