<script setup lang="ts">
const { getItems } = useDirectusItems();

const colors = useColors();

const {
  data: AccueilContactOptions,
  pending,
  error,
  refresh,
} = await useAsyncData("accueil_contact_options", () =>
  getItems<AccueilBoite>({
    collection: "accueil_contact_option",
  })
);
</script>
<template>
  <div id="contact-options">
    <GlobalCard v-for="boite in AccueilContactOptions" :small-title="boite.titre" :large-text="boite.texte">
        <GlobalLien>
          <template #icon><SvgSvrArrowUp :color="colors['light-grey']"/></template>
            <template #text>{{ boite.titre_du_lien }}</template>
        </GlobalLien>
    </GlobalCard>
  </div>
</template>
<style lang="scss" scoped>
#contact-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;

  @media screen and (max-width: $medium-breakpoint) {
    gap: 2rem;
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: $small-breakpoint) {
    gap: 1.5rem;
    grid-template-columns: 1fr;
  }
}
</style>