<script lang="ts" setup>
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'publicationsEtMedias',
});

const colors = useColors();
const locale = useI18n();

const {
  data: publicationsData,
  pending: publicationsDataPending,
  error: publicationsDataError,
  refresh: publicationsDataRefresh,
} = await useAsyncData("publications", () =>
  getSingletonItem<GenericListingPage>({
    collection: "publications",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);

const publications = useTranslatedItem(publicationsData, locale);

const {
  data: publicationListeRaw,
  pending: publicationListePending,
  error: publicationListeError,
  refresh: publicationListeRefresh,
} = await useAsyncData("publication-liste", () =>
  getItems<Publication>({
    collection: "publication",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);

const publicationListe = useTranslatedItems(publicationListeRaw, locale);

useSeoMeta({
    author: 'Projet Inclusion',
    title: publications.value?.titre,
    ogTitle: publications.value?.titre,
    ogDescription: publications.value?.texte,
})
</script>
<template>
  <div class="page-wrapper">
    <GlobalSection id="publications-et-medias">
      <div v-if="publications?.texte || publications?.titre" class="generic-listing-header">
        <h2 v-if="publications?.titre">{{ publications.titre }}</h2>
        <div v-if="publications?.texte" class="text" v-html="publications.texte" />
      </div>
      <div class="generic-listing large">
        <GlobalPublication v-for="publication in publicationListe" :publication="publication"/>
      </div>
    </GlobalSection>
  </div>
</template>
<style lang="scss" scoped>
#publications-et-medias {
  flex-grow: 1;

  background: $white;
}
</style>