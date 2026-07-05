<script lang="ts" setup>
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'Simpliquer',
});

const colors = useColors();
const locale = useI18n();

const {
  data: simpliquerData,
  pending: simpliquerPending,
  error: simpliquerError,
  refresh: simpliquerRefresh,
} = await useAsyncData("simpliquer", () =>
  getSingletonItem<Simpliquer>({
    collection: "simpliquer",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);
const simpliquer = useTranslatedItem(simpliquerData, locale);

const {
  data: faconDeSimpliquerListeData,
  pending: faconDeSimpliquerListePending,
  error: faconDeSimpliquerListeError,
  refresh: faconDeSimpliquerListeRefresh,
} = await useAsyncData("facons-de-simpliquer", () =>
  getItems<FaconDeSimpliquer>({
    collection: "facon_de_simpliquer",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);
const faconDeSimpliquerListe = useTranslatedItems(faconDeSimpliquerListeData, locale);


const spanifiedStaggerdSimpliquerTitle = computed(() => {
  if (!simpliquer.value?.sous_titre) return '';

  return simpliquer.value?.sous_titre.split('\n').map(word => `<span>${word}</span>`).join('')
})

useSeoMeta({
    author: 'Projet Inclusion',
    title: simpliquer.value?.titre,
    ogTitle: simpliquer.value?.titre,
    ogDescription: simpliquer.value?.texte,
})
</script>
<template>
  <div class="page-wrapper">
    <GlobalSection id="simpliquer" :small-title="simpliquer?.titre">
      <h3 class="big-title staggered-title" v-html="spanifiedStaggerdSimpliquerTitle" />
      <GlobalVHtml id="simpliquer-texte" class="large-body-text" :html="simpliquer?.texte" />
      <div id="facon-de-simpliquer-liste">
        <h3 class="big-title">{{ simpliquer?.facons_de_simpliquer_titre }}</h3>
        <div class="liste">
          <GlobalCard class="facon" v-for="facon in faconDeSimpliquerListe">
            <h4>{{ facon?.titre }}</h4>
            <GlobalVHtml class="small-body-text" :html="facon?.texte"></GlobalVHtml>
            <GlobalLien v-if="facon.lien" :lien="facon.lien" :color="colors['brown']">
              <template #icon>
                <SvgSvrArrowUp :color="colors['light-grey']" />
              </template>
              <template #text>{{ facon.lien_libelle }}</template>
            </GlobalLien>
          </GlobalCard>
        </div>
      </div>
    </GlobalSection>
  </div>
</template>
<style lang="scss" scoped>
#simpliquer {
  flex-grow: 1;

  background: $blue;
  color: $brown;

  .staggered-title {
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 4rem;

    :deep(span) {
      position: relative;
    }

    :nth-child(1) {
      left: 35%;

      @media screen and (max-width: $medium-breakpoint) {
        left: 35%;
      }

      @media screen and (max-width: $small-breakpoint) {
        left: 35%;
      }
    }

    :nth-child(2) {
      left: 0%;

      @media screen and (max-width: $small-breakpoint) {
        left: 0%;
      }
    }
  }

  #simpliquer-texte {
    max-width: 826px;
    margin: 0 auto;
    margin-bottom: 6rem;
  }

  #facon-de-simpliquer-liste {
    max-width: 1230px;
    margin: 0 auto;

    h3 {
      max-width: 100%;
      font-size: 2.25rem;

      margin-bottom: 4rem;
    }

    .liste {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;

      @media screen and (max-width: $medium-breakpoint) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media screen and (max-width: $small-breakpoint) {
        grid-template-columns: 1fr;
      }

      .facon {
        padding-top: 3.125rem;

        h4 {
          font-size: 2rem;
          line-height: 112%;
          font-weight: 400;

          @media screen and (max-width: $medium-breakpoint) {
            font-size: 1.5rem;
          }

          @media screen and (max-width: $small-breakpoint) {
            font-size: 1.25rem;
          }
        }
      }

    }
  }
}
</style>