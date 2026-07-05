<script setup lang="ts">
const { getSingletonItem, getItems, getItemById } = useDirectusItems();
const { getThumbnail } = useDirectusFiles();
import { useBreakpoints, useDateFormat, useNow } from '@vueuse/core';
import type { DirectusUser } from 'nuxt-directus';
import { Value } from 'sass';
const slug = useRoute().params.slug

const colors = useColors();
const locale = useI18n();

const {
  data: articleData,
  pending: articleDataPending,
  error: articleDataError,
  refresh: articleDataRefresh,
} = await useAsyncData(slug && slug.length ? slug[0] as string : '404', () =>
  getItems<Article>({
    collection: "article",
    params: {
        fields: ["*", "translations.*", "user_created.*"],
        filter: {
          slug: {
            _eq: slug ? slug[0] : ''
          }
        }
    },
  })
);

const articlesListe = useTranslatedItems(articleData, locale);
const article = computed(()=> articlesListe.value ? articlesListe.value[0] : undefined);

const date = computed(() => {
  if(!article.value) return ''
    if (locale.value === 'fr') {
        return useDateFormat(article.value.date_created, 'DD MMMM YYYY', { locales: 'fr-CA' }).value
    } else {
        return useDateFormat(article.value.date_created, 'MMMM DD YYYY', { locales: 'en-CA' }).value
    }
})

const metaHeading = computed(() => {
  return locale.value == 'fr' ? 
    `Par ${article.value?.user_created.first_name} le ${date.value}` :
    `By ${article.value?.user_created.first_name} the ${date.value}`
})

onMounted(() => {
   if(!article.value) navigateTo({name: '404'})
})

useSeoMeta({
    author: 'Projet Inclusion',
    title: article.value?.titre,
    ogTitle: article.value?.titre,
})
</script>
<template>
  <div class="page-wrapper">
    <GlobalSection id="full-article" v-if="article">
      <div id="inner-article">
        <p class="article-meta">{{ metaHeading  }}</p>
        <h2 class="article-title">{{ article.titre }}</h2>
        <div class="excerpt html-texte" v-if="article.intro" v-html="article.intro" />
        <div class="article-image" v-if="article.image">
          <GlobalImage :image="getThumbnail(article.image, {
              width: 1280,
              height: 1280,
              fit: 'inside',
              format: 'webp',
              quality: 90
          })" />
        </div>
        <div class="article-texte html-texte" v-html="article.texte" />
      </div>
    </GlobalSection>
  </div>
</template>
<style lang="scss" scoped>
#full-article {
  flex-grow: 1;

  background: $white;

  padding-bottom: 4rem;
}

#inner-article{
  display: flex;
  flex-direction: column;
  gap: 2rem;

  max-width: 880px;
}

.article-title{
  font-size: 1.375rem;
  line-height: 112%;
  font-weight: 400;

  transition: color .5s ease-in-out;

  @media screen and (max-width: $medium-breakpoint) {
    font-size: 1.25rem;
  }

  @media screen and (max-width: $small-breakpoint) {
    font-size: 1.25rem;
  }

  @media screen and (hover: hover){
    &:hover{
      color: $brown;
    }
  }
}

.article-image{
  width: 100%;
  height: clamp(500px, 1000px, 50svh);

  border-radius: 20px;
  overflow: hidden;
}
</style>