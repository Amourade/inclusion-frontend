<script lang="ts" setup>
import { onClickOutside, useBreakpoints } from '@vueuse/core';

const colors = useColors();
const breakPointsValues = useBreakpointsValues()
const breakpoints = useBreakpoints(breakPointsValues.value);
const menuItems: MainMenuLink[] = [
    {
        label: 'À propos',
        link: '#',
        submenu: [
            {
                label: 'Qui nous sommes',
                link: 'QuiNousSommes'
            },
            {
                label: 'Notre approche et implications',
                link: 'NotreApprocheEtImplications'
            }
        ]
    },
    {
        label: 'Projets',
        link: '#',
        submenu: [
            {
                label: 'Concertés',
                link: 'ProjetsConcertes'
            },
            {
                label: 'Nos espaces',
                link: 'NosEspaces'
            }
        ]
    },
    {
        label: 'S\'impliquer',
        link: 'Simpliquer'
    },
    {
        label: 'Actualités',
        link: 'index',
        submenu: [
            {
                label: 'On met quoi?',
                link: 'index'
            },
            {
                label: 'Dans ce menu?',
                link: 'index'
            }
        ]
    },
    {
        label: 'Soutien aux organisations',
        link: 'SoutienAuxOrganisations'
    },
    {
        label: 'Contact',
        link: 'Contact'
    },
    /* {
        label: 'Activités',
        link: 'index'
    }, */
]
const activeBreakpoint = breakpoints.active();
const menuRef = useTemplateRef('menuRef');
const showMenu = ref(false);

const toggleMenu = () => {
    console.log('menu button clicked', showMenu.value);
    showMenu.value = !showMenu.value;
}

onClickOutside(menuRef, () => {
    console.log('Clicked outsie');
    if(activeBreakpoint.value == 'small')
        showMenu.value = false
})
</script>
<template>
    <header id="header">
        <div id="logo">
            <h1><NuxtLink :to="{name: 'index'}"><SvgMainLogo /></NuxtLink></h1>
        </div>
        <nav id="menu" ref="menuRef">
            <button id="menu-button" :class="{'open': showMenu}" v-if="activeBreakpoint == 'small'" @click.prevent="toggleMenu">
                <span>Menu</span>
                <SvgDownArrow class="menu-arrow" :color="colors['orange']" />
            </button>
            <div id="inner-menu" v-show="activeBreakpoint == 'small' && showMenu || activeBreakpoint != 'small'">
                <ul>
                    <HeaderMainMenuLink v-for="item in menuItems" :key="item.label" :link="item" @closeMenu="showMenu = false" />
                </ul>
                <ul class="other-buttons">
                    <li>
                        <GlobalMainMenuLink class="agenda-link" to="#" @click="showMenu = false">
                            <span>Calendrier d'activités</span>
                        </GlobalMainMenuLink>
                    </li>
                    <li>
                        <GlobalMainMenuLink class="donate-link" to="#" @click="showMenu = false">
                            <span>Faire un don</span>
                     
                            <SvgDownArrow class="menu-arrow" :color="colors.orange"/>
                        </GlobalMainMenuLink>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>
<style lang="scss" scoped>
header{
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

#menu-button{
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

    svg{
        width: .75rem;
        height: .75rem;
        flex-shrink: 0;
        //rotate: 225deg;
    }

    &.open{
        svg{
            rotate: 180deg;
        }
    }
}

#logo{
    flex-shrink: 0;
}

#menu{
    //margin: 0 auto;
    position: relative;

    @media screen and (max-width: $small-breakpoint) {
        /* position: absolute;
        width: 100%;
        right: 0%; */
        margin: 0;
    }
}

#inner-menu{
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

        li{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
        }
    }
}

#menu ul{
    display: flex;
    flex-direction: row;
    gap: .25rem;
    flex-wrap: wrap;
    justify-content: flex-end;

    margin: 0 auto;

    li{
        flex-shrink: 0;
        width: max-content;
    }

    &.other-buttons{
        display: flex;
        flex-direction: row;
        gap: 1rem;

        justify-content: flex-end;
        margin: 0;

        li{
            a{
                background-color: $brown;
                color: $orange;
                padding-left: 1rem;
                padding-right: 1rem;
            }
            
            svg{
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

        li{
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            width: 100%;
        }
    }
}
</style>