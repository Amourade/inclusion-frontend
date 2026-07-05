<script lang="ts" setup>
const { getSingletonItem, getItems } = useDirectusItems();

definePageMeta({
  name: 'Contact',
});

const colors = useColors();
const locale = useI18n();

const {
  data: contactData,
  pending: contactPending,
  error: contactError,
  refresh: contactRefresh,
} = await useAsyncData("contact", () =>
  getSingletonItem<Contact>({
    collection: "contact",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);
const contact = useTranslatedItem(contactData, locale);

const {
  data: lieuxPartenairesListeData,
  pending: lieuxPartenairesListePending,
  error: lieuxPartenairesListeError,
  refresh: lieuxConcerteListeRefresh,
} = await useAsyncData("lieux-partenaires-liste", () =>
  getItems<LieuxPartenairesListe>({
    collection: "lieux_partenaire",
    params: {
        fields: ["*", "translations.*"]
    }
  })
);
const lieuxPartenairesListe = useTranslatedItems(lieuxPartenairesListeData, locale);

useSeoMeta({
    author: 'Projet Inclusion',
    title: contact.value?.titre,
    ogTitle: contact.value?.titre,
    ogDescription: contact.value?.texte,
})
</script>
<template>
  <div class="page-wrapper">
    <GlobalSection id="contact" :small-title="contact?.titre" :big-title="contact?.sous_titre">
      <SvgAccueilHero id="contact-svg" :color="colors.yellow" />
      <div id="contact-content">
        <div id="bureaux">
          <h4 class="small-body-text">{{ contact?.nos_bureaux_titre }}</h4>
          <GlobalVHtml class="medium-body-text html-texte" :html="contact?.nos_bureaux_texte" />
        </div>
        <GlobalVHtml id="contact-text" class="texte medium-body-text html-texte" :html="contact?.texte" />
      </div>
    </GlobalSection>
    <GlobalSection id="lieux-partenaires" :small-title="contact?.lieux_partenaires_titre"
      :big-title="contact?.lieux_partenaires_sous_titre">
      <div id="lieux-partenaires-liste">
        <div class="lieu-partenaire" v-for="lieu in lieuxPartenairesListe" :key="lieu.id">
          <h4 class="small-body-text">{{ lieu.titre }}</h4>
          <p class="large-body-text" v-html="lieu.texte" />
          <GlobalLien v-if="lieu.lien" :lien="lieu.lien" :color="colors['brown']">
            <template #icon>
              <SvgSvrArrowUp :color="colors['light-grey']" />
            </template>
            <template #text>{{ lieu.lien_libelle }}</template>
          </GlobalLien>
        </div>
      </div>
    </GlobalSection>
  </div>
</template>
<style lang="scss" scoped>
#contact-svg {
  position: absolute;
  top: 4rem;
  left: 60%;
  width: min(30%, 234px);
  height: auto;

  @media screen and (max-width: $medium-breakpoint) {
    left: 60%;
    top: 3rem;
    width: min(30%, 200px);
  }
  
  @media screen and (max-width: $small-breakpoint) {
    display: none;
  }
}

#contact {
  background-color: $white;
  color: $brown;

  flex-grow: 1;

  :deep(h3) {
    margin-bottom: 6rem;

    @media screen and (max-width: $small-breakpoint) {
      margin-bottom: 3rem;
    }
  }

  #contact-content {
    font-family: 'Inter', sans-serif;
    font-weight: 400;

    display: flex;
    gap: 2rem;

    margin-bottom: 3rem;

    #bureaux {
      width: 240px;
      flex-shrink: 0;

      h4 {
        margin-bottom: 1.3rem;
      }

      @media screen and (max-width: $medium-breakpoint) {
        width: 160px;
      }
    }

    #contact-text {
      flex-grow: 1;
      margin-top: 2.3rem;
    }

    @media screen and (max-width: $small-breakpoint) {
      flex-direction: column-reverse;

      #bureaux {
        margin-top: 1.5rem;
      }

      #contact-text {
        margin-top: 0;
      }
    }
  }
}

#lieux-partenaires {
  background-color: $green;
  color: $brown;

  :deep(h3) {
    margin-bottom: 4rem;

    @media screen and (max-width: $small-breakpoint) {
      margin-bottom: 3rem;
    }
  }

  #lieux-partenaires-liste {
    font-family: 'Inter', sans-serif;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;

    margin-bottom: 3rem;

    .lieu-partenaire {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: flex-start;

      p {
        flex-grow: 1;
        margin-bottom: 1rem;
      }
    }

    @media screen and (max-width: $medium-breakpoint) {
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem 2rem;
    }

    @media screen and (max-width: $small-breakpoint) {
      grid-template-columns: repeat(2, 1fr);
      gap: 3rem 1rem;
    }
  }
}
</style>