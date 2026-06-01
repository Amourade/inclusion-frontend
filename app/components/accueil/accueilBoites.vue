<script setup lang="ts">
const { getItems } = useDirectusItems();

const { locale } = useI18n();

const {
  data: AccueilBoiteData,
  pending: AccueilBoiteRawPending,
  error: AccueilBoiteRawError,
  refresh: AccueilBoiteRawRefresh,
} = await useAsyncData("accueil_boites", () =>
  getItems<AccueilBoite>({
    collection: "accueil_boite",
    params: {
      fields: ["*", "translations.*"]
    }
  })
);
const AccueilBoite = useTranslatedItems(AccueilBoiteData, locale);
</script>
<template>
  <GlobalSection>
    <div id="accueil-cards">
      <GlobalCard v-for="(boite, index) in AccueilBoite" :class="['card', 'card-' + index]" :small-title="boite.titre" :large-text="boite.texte">
          <GlobalLien v-if="boite.lien" :lien="boite.lien">
              <template #icon><SvgSvrArrowUp /></template>
              <template #text>{{ boite.titre_du_lien }}</template>
          </GlobalLien>
      </GlobalCard>
    </div>
  </GlobalSection>
</template>
<style lang="scss" scoped>
#accueil-cards {
  display: grid;
  grid-template-areas:
    "a a b b c c"
    "d d d e e e";
  gap: 1.5rem;

  @media screen and (max-width: $medium-breakpoint) {
    grid-template-areas:
      "a a b b"
      "c c d d"
      "e e e e";
  }

  @media screen and (max-width: $small-breakpoint) {
    grid-template-areas:
      "a a"
      "b b"
      "c c"
      "d d"
      "e e"
  }
}

.card-0 {
  grid-area: a;
}

.card-1 {
  grid-area: b;
}

.card-2 {
  grid-area: c;
}

.card-3 {
  grid-area: d;
}

.card-4 {
  grid-area: e;
}
</style>