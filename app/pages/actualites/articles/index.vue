<script lang="ts" setup>
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'blogue',
});

const colors = useColors();
const locale = useI18n();

const {
  data: blogueData,
  pending: blogueDataPending,
  error: blogueDataError,
  refresh: blogueDataRefresh,
} = await useAsyncData("blogue", () =>
  getSingletonItem<GenericListingPage>({
    collection: "blogue",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);

const blogue = useTranslatedItem(blogueData, locale);

const {
  data: articleListeRaw,
  pending: articleListePending,
  error: articleListeError,
  refresh: articleListeRefresh,
} = await useAsyncData("article-liste", () =>
  getItems<Article>({
    collection: "article",
    params: {
      fields: ["*", "translations.*"],
      filter: {
        status: {
          _eq: 'published'
        }
      },
      sort: ["-date_created"]
    },
  })
);

const articleListe = useTranslatedItems(articleListeRaw, locale);

useSeoMeta({
    author: 'Projet Inclusion',
    title: blogue.value?.titre,
    ogTitle: blogue.value?.titre,
    ogDescription: blogue.value?.texte,
})
</script>
<template>
  <div class="page-wrapper listing-wrapper">
    <GlobalSection id="galeries">
      <div v-if="blogue?.texte || blogue?.titre" class="generic-listing-header">
        <h2 v-if="blogue?.titre">{{ blogue.titre }}</h2>
        <div  v-if="blogue?.texte" class="text" v-html="blogue.texte" />
      </div>
      <div class="generic-listing">
        <GlobalArticle v-for="article in articleListe" :article="article"/>
      </div>
    </GlobalSection>
  </div>
</template>
<style lang="scss" scoped>
#galeries {
  flex-grow: 1;

  background: $white;
}

</style>