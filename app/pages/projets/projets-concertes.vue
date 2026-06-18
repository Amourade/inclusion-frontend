<script lang="ts" setup>
import slugify from 'slugify';
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'ProjetsConcertes',
  title: 'Projets concertés - Inclusion Montréal'
});

const colors = useColors();
const locale = useI18n();

const {
  data: projetsConcerteData,
  pending: projetsConcertePending,
  error: projetsConcerteError,
  refresh: projetsConcerteRefresh,
} = await useAsyncData("projets_concertes", () =>
  getSingletonItem<ProjetsConcertes>({
    collection: "projets_concertes",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);
const projetsConcerte = useTranslatedItem(projetsConcerteData, locale);

const {
  data: projetsListeData,
  pending: projetsListePending,
  error: projetsListeError,
  refresh: projetsListeRefresh,
} = await useAsyncData("projets_liste", () =>
  getItems<Projet>({
    collection: "projets",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);
const projetsListe = useTranslatedItems(projetsListeData, locale);
</script>
<template>
  <div>
    <GlobalSection id="projets-concertes" :small-title="projetsConcerte?.titre">
      <h3 class="big-title smaller-centered-content">{{ projetsConcerte?.sous_titre }}</h3>
      <GlobalVHtml id="projets-concertes-texte" class="smaller-centered-content large-body-text"
        :html="projetsConcerte?.texte_intro" />
    </GlobalSection>
    <GlobalSection id="projets-exemples">
      <GlobalVHtml id="projets-exemples-texte"
        class="smaller-centered-content large-body-text" :html="projetsConcerte?.texte_projets" />
      <div id="projets-liste">
        <template v-for="projet in projetsListe" :key="projet.id">
          <GlobalCard :id="slugify(projet.titre)" class="smaller-centered-content projet" :class="{ light: projet.boite_orange_pale }">
            <h3 class="large-body-text">{{ projet.titre }}</h3>
            <GlobalVHtml class="projet-texte html-texte medium-body-text" :html="projet.texte" />
            <GlobalLien v-if="projet.lien" :lien="projet.lien" :color="colors['light-black']">
              <template #icon>
                <SvgSvrArrowUp :color="colors['light-grey']" />
              </template>
              <template #text>{{ projet.lien_libelle }}</template>
            </GlobalLien>
          </GlobalCard>
        </template>
      </div>
    </GlobalSection>
  </div>
</template>
<style lang="scss" scoped>
#projets-concertes {
  background-color: $blue;
  color: $brown;

  flex-grow: 1;

  h3 {
    margin-bottom: 3rem;
  }

  #projets-concertes-texte {
    white-space: break-spaces;

    margin-bottom: 3rem;
  }
}

#projets-exemples {
  color: $brown;
  margin-top: 2rem;
  margin-bottom: 3rem;

  #projets-exemples-texte {
    margin-bottom: 3rem;
  }

  #projets-liste {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .projet {
    font-family: 'Montserrat', sans-serif;

    width: 100%;

    background-color: $orange;
    color: $black;

    border-bottom-right-radius: 70px;
    gap: 3rem;

    padding-top: 3.125rem;

    min-height: 611px;

    >* {
      max-width: 800px;
    }

    &.light {
      background-color: $very-light-orange;

      border-top-right-radius: 70px;
      border-bottom-right-radius: $cards-radius;

      min-height: 0px;
    }
  }
}
</style>