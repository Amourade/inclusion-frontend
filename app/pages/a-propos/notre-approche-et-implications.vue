<script lang="ts" setup>
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'NotreApprocheEtImplications',
  title: 'Qui nous sommes - Inclusion Montréal'
});

const colors = useColors();
const locale = useI18n();

const {
  data: approcheEtImplicationsData,
  pending: approcheEtImplicationsPending,
  error: approcheEtImplicationsError,
  refresh: approcheEtImplicationsRefresh,
} = await useAsyncData("approche_et_implications", () =>
  getSingletonItem<NotreApprocheEtImplications>({
    collection: "notre_approche_et_implications",
    params: {
      fields: ["*", "translations.*"]
    }
  })
);
const approcheEtImplications = useTranslatedItem(approcheEtImplicationsData, locale);

const {
  data: butsData,
  pending: butsPending,
  error: butsError,
  refresh: butsRefresh,
} = await useAsyncData("buts", () =>
  getItems<ApprocheEtImplicationsButs>({
    collection: "approche_et_implications_buts",
    params: {
      fields: ["*", "translations.*"]
    }
  })
);
const buts = useTranslatedItems(butsData, locale);

const {
  data: niveauxDactionData,
  pending: niveauxDactionPending,
  error: niveauxDactionError,
  refresh: niveauxDactionRefresh,
} = await useAsyncData("niveaux_daction", () =>
  getItems<NiveauxDactions>({
    collection: "niveaux_dactions",
    params: {
      fields: ["*", "translations.*"]
    }
  })
);
const niveauxDaction = useTranslatedItems(niveauxDactionData, locale);

const {
  data: implicationsListeData,
  pending: implicationsListePending,
  error: implicationsListeError,
  refresh: implicationsListeRefresh,
} = await useAsyncData("implications_liste", () =>
  getItems<ImplicationsListe>({
    collection: "implications_liste",
    params: {
      fields: ["*", "translations.*"]
    }
  })
);
const implicationsListe = useTranslatedItems(implicationsListeData, locale);

const spanifiedStaggerdApprocheEtImplicationsTitle = computed(() => {
  if (!approcheEtImplications.value?.approche_et_implications_sous_titre) return '';

  return approcheEtImplications.value?.approche_et_implications_sous_titre.split('\n').map(word => `<span>${word}</span>`).join('')
})
</script>
<template>
  <div>
    <GlobalSection id="approche-et-implications" :small-title="approcheEtImplications?.approche_et_implications_titre">
      <h3 class="big-title staggered-title" v-html="spanifiedStaggerdApprocheEtImplicationsTitle" />
      <GlobalVHtml id="approche-et-implications-texte" :html="approcheEtImplications?.approche_et_implications_texte" />
      <div id="approche-et-implications-buts">
        <div v-for="but in buts">
          <p>{{ but.texte }}</p>
        </div>
      </div>
    </GlobalSection>
    <GlobalSection id="niveaux-dactions" :big-title="approcheEtImplications?.niveaux_daction_titre">
      <div id="niveaux-dactions-liste">
        <div class="niveau" v-for="niveau in niveauxDaction">
          <h3>{{ niveau.titre }}</h3>
          <GlobalVHtml :html="niveau.texte" />
        </div>
      </div>
    </GlobalSection>
    <GlobalSection id="nos-implications" :big-title="approcheEtImplications?.implications_titre">
      <GlobalVHtml id="nos-implications-texte" :html="approcheEtImplications?.implications_texte" />
      <div id="nos-implications-liste">
        <div class="implication" v-for="implication in implicationsListe">
          <GlobalVHtml :html="implication.texte" />
        </div>
      </div>
    </GlobalSection>
  </div>
</template>
<style lang="scss" scoped>
#approche-et-implications {
  background-color: $blue;
  color: $brown;

  flex-grow: 1;

  .staggered-title {
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 4rem;

    :deep(span) {
      position: relative;
    }

    :nth-child(1) {
      left: 22%;

      @media screen and (max-width: $medium-breakpoint) {
        left: 20%;
      }

      @media screen and (max-width: $small-breakpoint) {
        left: 18%;
      }
    }

    :nth-child(2) {
      left: 0%;

      @media screen and (max-width: $small-breakpoint) {
        left: 0%;
      }
    }

    :nth-child(3) {
      left: 13%;

      @media screen and (max-width: $medium-breakpoint) {
        left: 12%;
      }

      @media screen and (max-width: $small-breakpoint) {
        left: 10%;
      }
    }
  }

  #approche-et-implications-texte {
    max-width: 880px;
    font-size: 2rem;
    line-height: 120%;
    font-weight: 400;

    margin: 0 auto;

    margin-bottom: 6rem;

    white-space: break-spaces;

    @media screen and (max-width: $medium-breakpoint) {
      font-size: 1.5rem;
    }

    @media screen and (max-width: $small-breakpoint) {
      font-size: 1.25rem;
      margin-bottom: 4rem;
    }
  }

  #approche-et-implications-buts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rem;

    margin-bottom: 4rem;

    p {
      font-size: 1.125rem;
      line-height: 160%;
      font-weight: 400;
      letter-spacing: -3%;
    }

    @media screen and (max-width: $medium-breakpoint) {
      grid-template-columns: repeat(2, 1fr);
      gap: 3rem;
    }

    @media screen and (max-width: $small-breakpoint) {
      grid-template-columns: 1fr;
      gap: 2rem;

      margin-bottom: 2rem;
    }
  }
}

#niveaux-dactions {
  background: $green;
  color: $brown;

  :deep(.big-title) {
    margin-bottom: 6rem;
  }

  #niveaux-dactions-liste {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rem;

    margin-bottom: 4rem;

    @media screen and (max-width: $medium-breakpoint) {
      grid-template-columns: repeat(2, 1fr);
      gap: 3rem;
    }

    @media screen and (max-width: $small-breakpoint) {
      grid-template-columns: 1fr;
      gap: 2rem;

      margin-bottom: 2rem;
    }
  }

  .niveau {
    font-family: 'Inter', sans-serif;

    h3 {
      font-size: 2rem;
      line-height: 112%;
      font-weight: 400;

      margin-bottom: 1rem;

      @media screen and (max-width: $small-breakpoint) {
        font-size: 1.5rem;
      }
    }

    p {
      font-size: 1.125rem;
      line-height: 120%;
      font-weight: 400;

      @media screen and (max-width: $small-breakpoint) {
        //font-size: 1rem;
      }
    }
  }
}

#nos-implications {
  background-color: $white;
  color: $brown;

  :deep(.big-title) {
    margin-bottom: 1.5rem;
  }

  #nos-implications-texte {
    max-width: 886px;
    font-size: 2rem;
    line-height: 120%;
    font-weight: 400;

    margin-bottom: 4rem;

    @media screen and (max-width: $medium-breakpoint) {
      font-size: 1.5rem;
    }

    @media screen and (max-width: $small-breakpoint) {
      font-size: 1.25rem;
    }
  }

  #nos-implications-liste {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 3rem;

    margin-bottom: 4rem;

    .implication {
      font-size: 1.25rem;
      line-height: 160%;
      font-weight: 600;

      @media screen and (max-width: $medium-breakpoint) {
        font-size: 1.125rem;
      }

      @media screen and (max-width: $small-breakpoint) {
        font-size: 1rem;
      }
    }

    @media screen and (max-width: $medium-breakpoint) {
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
    }

    @media screen and (max-width: $small-breakpoint) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      margin-bottom: 2rem;
    }
  }
}
</style>