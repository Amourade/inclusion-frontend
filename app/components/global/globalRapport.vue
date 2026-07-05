<script setup lang="ts">
const { getThumbnail } = useDirectusFiles();
import { useBreakpoints, useDateFormat, useNow } from '@vueuse/core';

const props = defineProps<{
    rapport: Rapport
}>()
const locale = useI18n();
const colors = useColors();

const date = computed(() => {
    if (locale.value === 'fr') {
        return useDateFormat(props.rapport.date_created, 'DD MMMM YYYY', { locales: 'fr-CA' })
    } else {
        return useDateFormat(props.rapport.date_created, 'MMMM DD YYYY', { locales: 'en-CA' })
    }
})

const hovered = ref(false)

const fileLink = computed(()=> {
    return props.rapport.fichier ? useRuntimeConfig().public.directus.url + '/assets/' + props.rapport.fichier : '';
})

const parsedLink = useParseLink(fileLink.value)
</script>
<template>
    <div class="listing centered" :class="{ hovered }">
        <div class="listing-image" @pointerenter="hovered = true" @pointercancel="hovered = false"
            @pointerout="hovered = false">
            <NuxtLink :to="parsedLink" 
            :external="typeof parsedLink == 'string'" 
            :target="typeof parsedLink == 'string' ? '_blank' : '_self'" 
            :class="{ external: typeof parsedLink == 'string' && parsedLink !== '#' }"
            :title="locale == 'fr' ? 'Télécharger le rapport: ' + rapport.titre : 'Download the report: ' + rapport.titre">
                <GlobalImage :image="getThumbnail(rapport.image, {
                    width: 1024,
                    height: 1024,
                    fit: 'inside',
                    format: 'webp'
                })" />
            </NuxtLink>
        </div>
        <GlobalRoundButton v-if="parsedLink !== '#'">
            <NuxtLink class="listing-button" :to="parsedLink" 
            :external="typeof parsedLink == 'string'" 
            :target="typeof parsedLink == 'string' ? '_blank' : '_self'" 
            :class="{ external: typeof parsedLink == 'string' && parsedLink !== '#' }"
            :title="locale == 'fr' ? 'Télécharger le rapport: ' + rapport.titre : 'Download the report: ' + rapport.titre">
                <span>{{ locale == 'fr' ? 'Télécharger' : 'Download' }}</span>
                <SvgShortDiagArrow v-if="typeof parsedLink == 'string'" :color="colors['light-grey']" />
            </NuxtLink>
        </GlobalRoundButton>
    </div>
</template>
<style lang="scss" scoped>
/**
Styles for the global lists are in main.scss
 */
 </style>