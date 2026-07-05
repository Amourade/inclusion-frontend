<script setup lang="ts">
const { getThumbnail } = useDirectusFiles();
import { useBreakpoints, useDateFormat, useNow } from '@vueuse/core';

const props = defineProps<{
    article: Article
}>()
const locale = useI18n();

const date = computed(() => {
    if (locale.value === 'fr') {
        return useDateFormat(props.article.date_created, 'DD MMMM YYYY', { locales: 'fr-CA' })
    } else {
        return useDateFormat(props.article.date_created, 'MMMM DD YYYY', { locales: 'en-CA' })
    }
})

const hovered = ref(false)
</script>
<template>
    <div class="listing" :class="{ hovered }">
        <div class="listing-image" @pointerenter="hovered = true" @pointercancel="hovered = false"
            @pointerout="hovered = false">
            <NuxtLink :to="`/actualites/articles/${article.slug}`" :title="locale == 'fr' ? 'Lire l\'article' : 'Read the article'">
                <GlobalImage :image="getThumbnail(article.image, {
                    width: 1024,
                    height: 1024,
                    fit: 'inside',
                    format: 'webp'
                })" />
            </NuxtLink>
        </div>
        <p class="listing-date">{{ date }}</p>
        <h2 class="listing-title">
            <NuxtLink :to="`/actualites/articles/${article.slug}`" @pointerenter="hovered = true" @pointercancel="hovered = false"
            @pointerout="hovered = false" :title="locale == 'fr' ? 'Lire l\'article' : 'Read the article'">
                {{ article.titre }}
            </NuxtLink>
        </h2>
        <NuxtLink class="listing-link" :to="`/actualites/articles/${article.slug}`" @pointerenter="hovered = true" @pointercancel="hovered = false"
            @pointerout="hovered = false">
            {{ locale == 'fr' ? 'Lire l\'article' : 'Read the article' }}
        </NuxtLink>
    </div>
</template>
<style lang="scss" scoped>
/**
Styles for the global lists are in main.scss
 */
 </style>