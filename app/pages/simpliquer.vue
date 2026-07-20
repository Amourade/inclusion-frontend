<script lang="ts" setup>
import { onKeyStroke } from '@vueuse/core';

const { getSingletonItem, getItems } = useDirectusItems();
const { getThumbnail } = useDirectusFiles();

definePageMeta({
  name: 'Simpliquer',
});

const colors = useColors();
const locale = useI18n();
const route = useRoute();
const router = useRouter();

const showFormulaireMembre = computed(() => route.hash === '#formulaire-membre');

const closeFormulaireMembre = () => {
  router.replace({ hash: '' });
};

onKeyStroke('Escape', () => { if (showFormulaireMembre.value) closeFormulaireMembre() });

watch(showFormulaireMembre, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : '';
}, { immediate: true });

onUnmounted(() => {
  document.body.style.overflow = '';
});

const {
  data: simpliquerData,
  pending: simpliquerPending,
  error: simpliquerError,
  refresh: simpliquerRefresh,
} = await useAsyncData("simpliquer", () =>
  getSingletonItem<Simpliquer>({
    collection: "simpliquer",
    params: {
        fields: ["*", "translations.*", "soutenu_par_logos.directus_files_id.*"]
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
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showFormulaireMembre" class="formulaire-membre-overlay">
          <GlobalLien lien="#" class="formulaire-membre-close no-text" @click.prevent="closeFormulaireMembre"
            :aria-label="locale == 'fr' ? 'Fermer' : 'Close'" animation="plus">
            <template #icon><SvgPlusSign /></template>
          </GlobalLien>
          <div class="formulaire-membre-iframe">
            <iframe 
            width="100%" 
            height="100%"
              :src="`https://forms.office.com/Pages/ResponsePage.aspx?id=${simpliquer?.id_formulaire_dinscription}`"
              frameborder="0" 
              style="border: none; max-width:100%;"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </Transition>
    </Teleport>
    <GlobalSection id="soutenu-par">
      <h3 class="small-body-text">{{ simpliquer?.soutenu_par_titre }}</h3>
      <div class="logos">
        <div class="logo-wrapper" v-for="logo in simpliquer?.soutenu_par_logos">
          <GlobalImage :cover="false" :image="getThumbnail(logo.directus_files_id.id, {
              width: 200,
              height: 200,
              fit: 'inside',
              format: 'webp',
              quality: 90
          })" :title="logo.directus_files_id.title" />
        </div>
      </div>
    </GlobalSection>
  </div>
</template>
<style lang="scss" scoped>
.formulaire-membre-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  padding-top: 3rem;

  background: rgba($light-grey, 0.9);

  @media screen and (max-width: $medium-breakpoint){
    padding: .5rem;
    padding-top: 3rem;
  }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.formulaire-membre-iframe {
  width: 100%;
  height: 100%;
  top: 1.5rem;
  border-radius: 20px;
  overflow: hidden;
}

.formulaire-membre-close {
  position: absolute;
  z-index: 1001;
  top: .5rem;
  right: 1rem;

  :deep(.icon svg) {
    transform: rotate(45deg);
  }

  @media screen and (max-width: $medium-breakpoint){
    top: .5rem;
    right: .5rem;
  }
}

#soutenu-par{
  text-align: center;
  color: $brown;
  background: transparent;
  padding-top: 3rem;
  padding-bottom: 4rem;

  h3{
    margin-bottom: 4rem;
  }

  .logos{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 3.375rem;
    justify-content: center;
  }

  .logo-wrapper{
    width: 150px; 
    height: 50px;
    position: relative;
  }
}
#simpliquer {
  flex-grow: 1;

  background: $blue;
  color: $brown;

  padding-bottom: 3rem;

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