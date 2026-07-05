<script lang="ts" setup>
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'galeries',
});

const colors = useColors();
const locale = useI18n();

const {
  data: galeriesData,
  pending: galeriesDataPending,
  error: galeriesDataError,
  refresh: galeriesDataRefresh,
} = await useAsyncData("galeries", () =>
  getSingletonItem<GenericListingPage>({
    collection: "galeries",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);

const galeries = useTranslatedItem(galeriesData, locale);

const {
  data: galerieListeRaw,
  pending: galerieListePending,
  error: galerieListeError,
  refresh: galerieListeRefresh,
} = await useAsyncData("galerie-liste", () =>
  getItems<Galerie>({
    collection: "galerie",
    params: {
        fields: ["*", "translations.*", "images.*"]
    }
  })
);

const galerieListe = useTranslatedItems(galerieListeRaw, locale);

useSeoMeta({
    author: 'Projet Inclusion',
    title: galeries.value?.titre,
    ogTitle: galeries.value?.titre,
    ogDescription: galeries.value?.texte,
})
</script>
<template>
  <div class="page-wrapper">
    <GlobalSection id="galeries">
      <div v-if="galeries?.texte || galeries?.titre" class="generic-listing-header">
        <h2 v-if="galeries?.titre">{{ galeries.titre }}</h2>
        <div  v-if="galeries?.texte" class="text" v-html="galeries.texte" />
      </div>
      <div class="galeries generic-listing">
        <GlobalGalerie v-for="galerie in galerieListe" :galerie="galerie"/>
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