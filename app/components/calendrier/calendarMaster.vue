<script lang="ts" setup>
import { useBreakpoints, useDateFormat, useNow, useMounted, useTemplateRefsList } from '@vueuse/core';
import CalendarEvent from '~/components/calendrier/calendarEvent.vue';
import CalendarWidget from '~/components/calendrier/calendarWidget.vue';
const { getSingletonItem, getItems } = useDirectusItems();

const props = defineProps<{
  compactMode: boolean
}>()

const colors = useColors();
const { locale } = useI18n();
const d = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Toronto"})); // timezone ex: Asia/Jerusalem
const nowMonth = useDateFormat(d, 'M',);
const nowYear = useDateFormat(d, 'YYYY',);
const breakPointsValues = useBreakpointsValues()
const breakpoints = useBreakpoints(breakPointsValues.value);
const activeBreakpoint = breakpoints.active();
const mounted = useMounted();

const query = useRoute().query
const parsedQueryYear = parseInt(query.year as string)
const parsedQueryMonth = parseInt(query.month as string)
const parsedQueryId = parseInt(query.id as string)
let initialScrollAtDone = false;

const displayYear = ref(parsedQueryYear ? parsedQueryYear : parseInt(nowYear.value))
const displayMonth = ref(parsedQueryMonth ? parsedQueryMonth : parseInt(nowMonth.value));

const monthNames = {
  fr: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
}

const monthName = computed(() => monthNames[locale.value][displayMonth.value - 1])

const {
  data: calendrierData,
  pending: calendrierPending,
  error: calendrierError,
  refresh: calendrierRefresh,
} = await useAsyncData(props.compactMode ? "calendrier-compact" : "calendrier", () =>
  getSingletonItem<Calendrier>({
    collection: "calendrier",
    params: {
      fields: ["*", "translations.*"],
    }
  })
);
const calendrier = useTranslatedItem(calendrierData, locale);

const {
  data: evenementsData,
  pending: evenementsPending,
  error: evenementsError,
  refresh: evenementsRefresh,
} = await useAsyncData(props.compactMode ? "evenements-liste-compact" : "evenement-liste", () =>
  getItems<Evenement>({
    collection: "evenement",
    params: {
      fields: ["*", "translations.*", "categories.*"],
      filter: {
        status: {
          _eq: 'published'
        },
        "year(date)": {
          _eq: displayYear.value
        },
        "month(date)": {
          _eq: displayMonth.value
        }
      },
      sort: ["date", "heure_debut"]
    }
  })
);
const evenementsListe = useTranslatedItems(evenementsData, locale);
const fileteredEvenements = computed(() => {
  return evenementsListe.value?.filter(event => {

    const matchesCategory = activeFilters.value.length === 0 || event.categories.some(cat => activeFilters.value.includes(cat.evenement_categorie_id as number));

    const matchesInscription = (/* !avecInscriptionFilterActive.value &&  */!sansInscriptionFilterActive.value)/*  || (avecInscriptionFilterActive.value && event.inscription_requise) */ || (sansInscriptionFilterActive.value && !event.inscription_requise);

    if (activeFilters.value.length === 0) return matchesInscription
    if (/* !avecInscriptionFilterActive.value &&  */!sansInscriptionFilterActive.value) return matchesCategory

    return matchesCategory || matchesInscription;
  }) || [];
})
const eventsRefs = useTemplateRefsList()

const {
  data: categoriesData,
  pending: categoriesPending,
  error: categoriesError,
  refresh: categoriesRefresh,
} = await useAsyncData(props.compactMode ? "categories-compact" : "categories", () =>
  getItems<EvenementCategorie>({
    collection: "evenement_categorie",
    params: {
      fields: ["*", "translations.*"]
    }
  })
);
const categories = useTranslatedItems(categoriesData, locale);
const activeFilters = ref<number[]>([]);
const avecInscriptionFilterActive = ref(false);
const sansInscriptionFilterActive = ref(false);

function previousMonth() {
  if (displayMonth.value === 1) {
    displayMonth.value = 12
    displayYear.value--
  } else {
    displayMonth.value--
  }
}

function nextMonth() {
  if (displayMonth.value === 12) {
    displayMonth.value = 1
    displayYear.value++
  } else {
    displayMonth.value++
  }
}

const toggleFilter = (categoryId: number) => {
  if (activeFilters.value.includes(categoryId)) {
    activeFilters.value = activeFilters.value.filter(id => id !== categoryId);
  } else {
    activeFilters.value.push(categoryId);
  }
}

const getFilterTitlePrefix = (active: boolean): string => {
  if (locale.value === 'fr') {
    return active ? 'Retirer le filtre: ' : 'Ajouter le filtre: ';
  } else {
    return active ? 'Remove filter: ' : 'Add filter: ';
  }
}

const removeFilters = () => {
  activeFilters.value = [];
  avecInscriptionFilterActive.value = false;
  sansInscriptionFilterActive.value = false;
}

const navigateToEvent = (id: number) => {
  navigateTo({ name: 'Calendrier', query: { id, month: displayMonth.value, year: displayYear.value } })
}

watch([evenementsPending, mounted], (newVal) => {
  if (!newVal[0] && newVal[1] && parsedQueryId) {
    // Wait for the DOM to update with the new events
    nextTick(() => {
      const eventElement = document.getElementById(parsedQueryId.toString());
      if (eventElement && !initialScrollAtDone) {
        setTimeout(() => {
          const eventElement = document.getElementById(parsedQueryId.toString());
          eventElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        initialScrollAtDone = true;
      }
    });
  }
}, { immediate: true })

let highLightTimeout: number;

const highlightEvents = (ids: number[]) => {
  if (ids.length == 0) return;

  clearTimeout(highLightTimeout)

  let earliestEventTime: number;
  let earliestEvent: number

  ids.forEach((id) => {
    const event = fileteredEvenements.value.find((e) => e.id == id);
    if (!event) return;

    const splitHeure = event.heure_debut.split(':');
    if (!splitHeure[0] || !splitHeure[1]) return;

    const time = (parseInt(splitHeure[0]) * 1000) + parseInt(splitHeure[1])

    if (!earliestEventTime || earliestEventTime > time) {
      earliestEventTime = time;
      earliestEvent = id
    }
  })

  if(earliestEvent){
    const eventElement = document.getElementById(earliestEvent.toString());
    eventElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    highLightTimeout = setTimeout(() => {
      eventsRefs.value.forEach((e)=>e.highlight(ids))
    }, 500)
  }
}

watch([displayMonth, displayYear], () => {
  evenementsRefresh();
})

onMounted(() => {
  console.log("refreshing for: ", displayMonth.value, displayYear.value)
  evenementsRefresh();
})

onUnmounted(() => {
  clearTimeout(highLightTimeout)
})
</script>
<template>
  <GlobalSection id="calendar" :small-title="calendrier?.titre" :big-title="calendrier?.sous_titre">
    <div class="calendar-header" :class="{ compact: compactMode }">
      <div class="month-nav" v-if="activeBreakpoint !== 'small' && compactMode">
        <button class="nav-btn previous" @click="previousMonth"
          :aria-label="locale == 'fr' ? 'Mois précédent' : 'Previous month'"
          :title="locale == 'fr' ? 'Mois précédent' : 'Previous month'">
          <SvgSideArrow :color="colors['light-black']" />
        </button>
        <span class="current-month">{{ monthName }} {{ displayYear }}</span>
        <button class="nav-btn next" @click="nextMonth" :aria-label="locale == 'fr' ? 'Mois suivant' : 'Next month'"
          :title="locale == 'fr' ? 'Mois suivant' : 'Next month'">
          <SvgSideArrow :color="colors['light-black']" />
        </button>
      </div>
      <div id="calendar-categories">
        <button
          :class="[{ active: activeFilters.length === 0 /* && !avecInscriptionFilterActive */ && !sansInscriptionFilterActive }, 'category-btn']"
          @click.prevent="removeFilters" :aria-label="locale == 'fr' ?
            'Retirer tous les filtres' : 'Remove all filters'" :title="locale == 'fr' ?
              'Retirer tous les filtres' : 'Remove all filters'">
          {{ locale == 'fr' ? 'Tout' : 'All' }}
        </button>
        <!-- <button :class="[{ active: avecInscriptionFilterActive }, 'category-btn']"
          @click.prevent="avecInscriptionFilterActive = !avecInscriptionFilterActive" :aria-label="locale == 'fr' ?
            getFilterTitlePrefix(avecInscriptionFilterActive) + 'événements avec inscription' :
            getFilterTitlePrefix(avecInscriptionFilterActive) + 'events with registration'" :title="locale == 'fr' ?
              getFilterTitlePrefix(avecInscriptionFilterActive) + 'événements avec inscription' :
              getFilterTitlePrefix(avecInscriptionFilterActive) + 'events with registration'">
          {{ calendrier?.libelle_categorie_avec_inscription }}
        </button> -->
        <button :class="[{ active: sansInscriptionFilterActive }, 'category-btn']"
          @click.prevent="sansInscriptionFilterActive = !sansInscriptionFilterActive" :aria-label="locale == 'fr' ?
            getFilterTitlePrefix(sansInscriptionFilterActive) + 'événements sans inscription' :
            getFilterTitlePrefix(sansInscriptionFilterActive) + 'events without registration'" :title="locale == 'fr' ?
              getFilterTitlePrefix(sansInscriptionFilterActive) + 'événements sans inscription' :
              getFilterTitlePrefix(sansInscriptionFilterActive) + 'events without registration'">
          {{ calendrier?.libelle_categorie_sans_inscription }}
        </button>
        <div v-for="cat in categories" :key="cat.id">
          <button :class="[{ active: activeFilters.includes(cat.id as number) }, 'category-btn']"
            @click.prevent="toggleFilter(cat.id as number)" :aria-label="locale == 'fr' ?
              getFilterTitlePrefix(activeFilters.includes(cat.id as number)) + cat.libelle :
              getFilterTitlePrefix(activeFilters.includes(cat.id as number)) + cat.libelle" :title="locale == 'fr' ?
                getFilterTitlePrefix(activeFilters.includes(cat.id as number)) + cat.libelle :
                getFilterTitlePrefix(activeFilters.includes(cat.id as number)) + cat.libelle">
            {{ cat.libelle }}
          </button>
        </div>
      </div>
    </div>
    <section id="calendar-body">
      <div id="calender-widget-wrapper" v-if="activeBreakpoint == 'small' && compactMode || !compactMode">
        <CalendarWidget v-if="activeBreakpoint !== 'small'" v-model:month="displayMonth" v-model:year="displayYear"
          :events="evenementsPending ? [] : fileteredEvenements" @highlight-events="highlightEvents" />
        <div class="month-nav" v-if="activeBreakpoint == 'small'">
          <button class="nav-btn previous" @click="previousMonth"
            :aria-label="locale == 'fr' ? 'Mois précédent' : 'Previous month'"
            :title="locale == 'fr' ? 'Mois précédent' : 'Previous month'">
            <SvgSideArrow :color="colors['light-black']" />
          </button>
          <span class="current-month">{{ monthName }} {{ displayYear }}</span>
          <button class="nav-btn next" @click="nextMonth" :aria-label="locale == 'fr' ? 'Mois suivant' : 'Next month'"
            :title="locale == 'fr' ? 'Mois suivant' : 'Next month'">
            <SvgSideArrow :color="colors['light-black']" />
          </button>
        </div>
      </div>
      <div id="calendar-events" v-if="fileteredEvenements.length" :class="{ compact: compactMode }">
        <CalendarEvent v-for="evenement in fileteredEvenements" ref="eventsRefs" :key="evenement.id" :event="evenement"
          :compact="compactMode" :categories="categories" @go-to-event="navigateToEvent" />
      </div>
      <p v-else class="no-events">{{ calendrier?.pas_devenements_message }}</p>
    </section>
  </GlobalSection>
</template>
<style lang="scss" scoped>
#calendar {
  background-color: $light-orange;
  color: $light-black;

  flex-grow: 1;

  :deep(.big-title) {
    font-weight: 500;
    letter-spacing: -1%;

    margin-bottom: 3rem;
  }
}

.month-nav {
  display: flex;
  align-items: center;
  gap: .5rem;

  flex-grow: 0;
  flex-shrink: 0;

  .current-month {
    font-size: 1.125rem;
    line-height: 120%;
    font-weight: 600;

    min-width: 10rem;
    text-align: center;
  }

  .nav-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: $light-black;

    flex-shrink: 0;

    svg {
      height: .975rem;
      width: auto;
    }

    &.previous {
      transform: rotate(180deg);
    }
  }
}

.calendar-header {
  display: flex;
  align-items: center;
  //justify-content: space-between;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;

  border-bottom: 1px solid rgba($light-black, 16%);

  &.compact {
    justify-content: space-between;
  }

  #calendar-categories {
    display: flex;
    align-items: center;
    //justify-content: flex-end;
    justify-content: center;
    gap: .5rem;
    flex-wrap: wrap;

    .category-btn {
      background-color: transparent;
      pointer-events: auto;
      opacity: 1;

      font-weight: 600;
      font-size: .75rem;
      padding: .25rem .5rem;
      border: 1px solid transparent;
      border-radius: 2.5rem;

      cursor: pointer;

      transition: border-color 0.2s;

      &.active {
        border: 1px solid $light-black;
      }

      @media screen and (max-width: $medium-breakpoint) {
        font-size: .85rem;
      }

      @media screen and (max-width: $small-breakpoint) {
        font-size: .85rem;
      }

      @media screen and (hover: hover) {
        &:not(.active):hover {
          border: 1px solid $light-black;
        }
      }
    }

    @media screen and (max-width: $small-breakpoint) {
      justify-content: center;
    }
  }

  @media screen and (max-width: $small-breakpoint) {
    flex-direction: column;
    //justify-content: flex-start;
  }
}

#calender-widget-wrapper {
  display: flex;
  justify-content: center;

  flex-shrink: 0;
}

#calendar-body {
  display: flex;
  gap: 1.5rem;

  align-items: flex-start;

  @media screen and (max-width: $medium-breakpoint) {
    gap: 1rem;
  }

  @media screen and (max-width: $small-breakpoint) {
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }
}

#calendar-events {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 100%;

  &.compact {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    @media screen and (max-width: $medium-breakpoint) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: $small-breakpoint) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  >div:nth-child(2n) {
    background-color: $very-light-orange !important;
    color: $brown !important;
  }
}

.no-events {
  font-weight: 500;
  font-size: 1rem;
  width: 100%;
  text-align: center;
}
</style>