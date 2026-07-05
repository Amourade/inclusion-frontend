<script lang="ts" setup>
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'rapports_annuels',
});

const colors = useColors();
const locale = useI18n();

const {
  data: rapportsAnnuelsData,
  pending: rapportsAnnuelsPending,
  error: rapportsAnnuelsError,
  refresh: rapportsAnnuelsRefresh,
} = await useAsyncData("rappports_anuels", () =>
  getSingletonItem<GenericListingPage>({
    collection: "rapports_annuels",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);

const rapportsAnnuels = useTranslatedItem(rapportsAnnuelsData, locale);

const {
  data: rapportsListeRaw,
  pending: rapportsListePending,
  error: rapportsListeError,
  refresh: rapportsListeRefresh,
} = await useAsyncData("rapports-liste", () =>
  getItems<Rapport>({
    collection: "rapport",
    params: {
        fields: ["*", "translations.*"],
        sort: ["-date_created"]
      },
  })
);

const rapportsListe = useTranslatedItems(rapportsListeRaw, locale);

useSeoMeta({
    author: 'Projet Inclusion',
    title: rapportsAnnuels.value?.titre,
    ogTitle: rapportsAnnuels.value?.titre,
    ogDescription: rapportsAnnuels.value?.texte,
})
</script>
<template>
  <div class="page-wrapper">
    <GlobalSection id="galeries">
      <div v-if="rapportsAnnuels?.texte || rapportsAnnuels?.titre" class="generic-listing-header">
        <h2 v-if="rapportsAnnuels?.titre">{{ rapportsAnnuels.titre }}</h2>
        <div  v-if="rapportsAnnuels?.texte" class="text" v-html="rapportsAnnuels.texte" />
      </div>
      <div class="generic-listing">
        <GlobalRapport v-for="rapport in rapportsListe" :rapport="rapport"/>
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