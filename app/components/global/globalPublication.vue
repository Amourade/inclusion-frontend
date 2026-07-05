<script setup lang="ts">
const { getThumbnail } = useDirectusFiles();
import { useBreakpoints, useDateFormat, useNow } from '@vueuse/core';

const props = defineProps<{
    publication: Publication
}>()
const colors = useColors();
const locale = useI18n();

const hovered = ref(false)
const fileLink = computed(()=> {
    return props.publication.lien_fichier ? useRuntimeConfig().public.directus.url + '/assets/' + props.publication.lien_fichier : '';
})

const parsedLink = useParseLink(fileLink.value ? fileLink.value : props.publication.lien)
</script>
<template>
    <div class="listing centered" :class="{ hovered }">
        <h2 class="listing-title" v-if="publication.titre">
            {{ publication.titre }}
        </h2>
        <div class="listing-text html-texte" v-if="publication.description" v-html="publication.description" />
        <GlobalRoundButton v-if="parsedLink !== '#'">
            <NuxtLink class="listing-button" :to="parsedLink" 
            :external="typeof parsedLink == 'string'" 
            :target="typeof parsedLink == 'string' ? '_blank' : '_self'" 
            :class="{ external: typeof parsedLink == 'string' && parsedLink !== '#' }"
            :title="publication.lien_libelle"
             >
                <span>{{ publication.lien_libelle }}</span>
                <SvgShortDiagArrow v-if="typeof parsedLink == 'string'" :color="colors['light-grey']" />
            </NuxtLink>
        </GlobalRoundButton>
        <div class="listing-raw-html" v-if="publication.html" v-html="publication.html" />
    </div>
</template>
<style lang="scss" scoped>
/**
Styles for the global lists are in main.scss
 */
 </style>