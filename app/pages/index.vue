<script setup lang="ts">
import CalendarMaster from '~/components/calendrier/calendarMaster.vue';

const { getSingletonItem } = useDirectusItems();

definePageMeta({
    name: 'index'
});

const locale = useI18n();

const {
    data: AccueilData,
    pending: pendingAccueilRaw,
    error: errorAccueilRaw,
    refresh: refreshAccueilRaw,
} = await useAsyncData("accueil", () =>
    getSingletonItem<Accueil>({
    collection: "accueil",
    params: {
      fields: ["*", "translations.*"]
    }
  })
);
const Accueil = useTranslatedItem(AccueilData, locale);
</script>
<template>
    <div class="page-wrapper">
        <AccueilHero />
        <GlobalSection id="accueil-intro" :small-title="Accueil?.intro_titre">
            <p>{{ Accueil?.intro_texte }}</p>
        </GlobalSection>
        <AccueilBoites />
        <CalendarMaster :compact-mode="true" />
        <GlobalSection id="accueil-contactez-nous" :small-title="Accueil?.contactez_nous_titre"
            :big-title="Accueil?.contactez_nous_sous_titre">
            <SvgAccueilContactSvg id="svg-accueil-contact" />
            <AccueilContactOptions />
        </GlobalSection>
    </div>
</template>
<style lang="scss" scoped>
#accueil-intro {
    background-color: $blue;
    color: $brown;

    flex-grow: 1;

    padding: 50px 0px;

    @media screen and (max-width: $medium-breakpoint) {
        font-size: 1.5rem;
        padding: 40px 0px;
    }

    @media screen and (max-width: $small-breakpoint) {
        font-size: 1.25rem;
        padding: 30px 0px;
    }

    p {
        font-size: 2rem;
        line-height: 120%;
        font-weight: 400;

        max-width: 960px;
        margin: 0 auto;

        @media screen and (max-width: $medium-breakpoint) {
            font-size: 1.5rem;
        }

        @media screen and (max-width: $small-breakpoint) {
            font-size: 1.25rem;
        }
    }
}

#svg-accueil-contact {
    position: absolute;
    top: 3rem;
    left: min(800px, 75%);
    width: min(23%, 280px);
    height: auto;
    object-fit: cover;
    z-index: 2;

    @media screen and (max-width: $medium-breakpoint) {
        left: min(550px, 75%);
        top: 2rem;
    }

    @media screen and (max-width: $small-breakpoint) {
        display: none;
    }
}

#accueil-contactez-nous {
    background: $light-grey;
    color: $brown;

    :deep(.big-title) {
        min-height: 10rem;
    }

    @media screen and (max-width: $medium-breakpoint) {
        :deep(.big-title) {
            min-height: 7.2rem;
        }
    }

    @media screen and (max-width: $small-breakpoint) {
        :deep(.big-title) {
            min-height: auto;
        }
    }
}
</style>