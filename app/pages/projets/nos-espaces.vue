<script lang="ts" setup>
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'NosEspaces',
  title: 'Nos espaces - Inclusion Montréal'
});

const colors = useColors();

const {
  data: nosEspaces,
  pending,
  error,
  refresh,
} = await useAsyncData("nos_espaces", () =>
  getSingletonItem<NosEspaces>({
    collection: "nos_espaces",
  })
);

const {
  data: espaceListe,
  pending: espaceListePending,
  error: espaceListeError,
  refresh: espaceListeRefresh,
} = await useAsyncData("espaces_liste", () =>
  getItems<Espace>({
    collection: "espace",
  })
);

</script>
<template>
  <GlobalSection id="nos-espaces" :small-title="nosEspaces?.titre">
    <h3 class="big-title smaller-centered-content">{{ nosEspaces?.sous_titre }}</h3>
    <div id="nos-espaces-texte" class="smaller-centered-content large-body-text" v-html="nosEspaces?.texte" />
  </GlobalSection>
  <GlobalSection id="espaces-liste-section">
    <div id="espaces-liste">
      <template v-for="espace in espaceListe" :key="espace.id">
        <GlobalCard class="smaller-centered-content projet" :class="{ light: espace.boite_orange_pale }">
          <h3 class="large-body-text">{{ espace.titre }}</h3>
          <div class="projet-texte html-texte medium-body-text" v-html="espace.texte" />
          <GlobalLien v-if="espace.lien" :href="espace.lien" target="_blank" :color="colors['light-black']">
            <template #icon>
              <SvgSvrArrowUp :color="colors['light-grey']" />
            </template>
            <template #text>{{ espace.lien_libelle }}</template>
          </GlobalLien>
        </GlobalCard>
      </template>
    </div>
  </GlobalSection>
</template>
<style lang="scss" scoped>
#nos-espaces {
  background-color: $blue;
  color: $brown;

  flex-grow: 1;

  h3 {
    margin-bottom: 3rem;
  }

  #nos-espaces-texte {
    margin-bottom: 3rem;
  }
}

#espaces-liste-section {
  margin: 3rem 0;

  #espaces-liste {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media screen and (max-width: $medium-breakpoint) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: $small-breakpoint) {
      grid-template-columns: 1fr;
    }

    .projet {
      font-family: 'Montserrat', sans-serif;

      gap: 3rem;

      width: 100%;

      background-color: $orange;
      color: $black;

      border-bottom-right-radius: 70px;

      >* {
        max-width: 800px;
      }

      &.light {
        background-color: $very-light-orange !important;

        border-top-right-radius: 70px;
        border-bottom-right-radius: $cards-radius;
      }

      @media screen and (min-width: $small-breakpoint) {

        &:nth-child(4n+1),
        &:nth-child(4n+4) {
          background-color: $light-orange;
        }
      }

      @media screen and (max-width: $small-breakpoint) {
        &:nth-child(odd) {
          background-color: $light-orange;
        }
      }
    }
  }
}
</style>