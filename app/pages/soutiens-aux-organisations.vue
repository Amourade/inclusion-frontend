<script lang="ts" setup>
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'SoutienAuxOrganisations',
  title: 'Soutient aux organisations - Inclusion Montréal'
});

const colors = useColors();
const { locale } = useI18n();

const {
  data: soutienAuxOrganisationsData,
  pending: soutienAuxOrganisationsPending,
  error: soutienAuxOrganisationsError,
  refresh: soutienAuxOrganisationsRefresh,
} = await useAsyncData("soutient-aux-organisations", () =>
  getSingletonItem<SoutienAuxOrganisations>({
    collection: "soutien_aux_organisations",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);
const soutienAuxOrganisations = useTranslatedItem(soutienAuxOrganisationsData, locale);

const {
  data: ideesThemesListeRaw,
  pending: ideesThemesListePending,
  error: ideesThemesListeError,
  refresh: ideesThemesListeRefresh,
} = await useAsyncData("idees-themes-liste", () =>
  getItems<IdeesThemesListe>({
    collection: "idees_themes",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);
const ideesThemesListe = useTranslatedItems(ideesThemesListeRaw, locale);
</script>
<template>
  <GlobalSection id="soutien-aux-organisations" :small-title="soutienAuxOrganisations?.titre">
    <h3 class="big-title" v-html="soutienAuxOrganisations?.sous_titre" />
    <GlobalVHtml id="soutient-aux-organisations-intro-texte" class="large-body-text"
      :html="soutienAuxOrganisations?.texte_intro" />
    <GlobalVHtml id="soutient-aux-organisations-description-texte" class="small-body-text html-texte"
      :html="soutienAuxOrganisations?.texte_description" />
    <div id="idees-themes-liste">
      <div class="idee" v-for="idee in ideesThemesListe">
        <p class="medium-body-text">{{ idee?.texte }}</p>
      </div>
    </div>
    <GlobalVHtml id="soutient-aux-organisations-bas-texte" class="html-texte small-body-text"
      :html="soutienAuxOrganisations?.texte_bas" />
  </GlobalSection>
</template>
<style lang="scss" scoped>
#soutien-aux-organisations {
  flex-grow: 1;

  background: $white;
  color: $brown;

  h3 {
    margin-bottom: 2rem;
    max-width: 890px;
  }

  #soutient-aux-organisations-intro-texte {
    margin-bottom: 4rem;
    max-width: 890px;
  }

  #soutient-aux-organisations-description-texte {
    margin-bottom: 3rem;
  }

  #soutient-aux-organisations-bas-texte {
    margin-bottom: 3rem;
  }

  #idees-themes-liste {
    margin-bottom: 4rem;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;

    .idee p {
      font-weight: 600;
    }

    @media screen and (max-width: $medium-breakpoint) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: $small-breakpoint) {
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
    }
  }
}
</style>