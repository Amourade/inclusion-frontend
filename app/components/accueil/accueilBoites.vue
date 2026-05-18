<script setup lang="ts">
const { getItems } = useDirectusItems();

const {
  data: AccueilBoite,
  pending,
  error,
  refresh,
} = await useAsyncData("accueil_boites", () =>
  getItems<AccueilBoite>({
    collection: "accueil_boite",
  })
);
</script>
<template>
  <GlobalSection>
    <div id="accueil-cards">
      <GlobalCard v-for="(boite, index) in AccueilBoite" :class="['card', 'card-' + index]" :small-title="boite.titre" :large-text="boite.texte">
          <GlobalLien>
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