<script lang="ts" setup>
import { useBreakpoints, useDateFormat, useNow, useMounted, useTemplateRefsList, useScroll, usePointerSwipe } from '@vueuse/core';
import CalendarEvent from '~/components/calendrier/calendarEvent.vue';
import CalendarWidget from '~/components/calendrier/calendarWidget.vue';
const { getSingletonItem, getItems } = useDirectusItems();

const props = defineProps<{
  compactMode: boolean
}>()

const colors = useColors();
const locale = useI18n();
const d = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" })); // timezone ex: Asia/Jerusalem
const nowMonth = useDateFormat(d, 'M',);
const nowYear = useDateFormat(d, 'YYYY',);
const breakPointsValues = useBreakpointsValues()
const breakpoints = useBreakpoints(breakPointsValues.value);
const activeBreakpoint = breakpoints.active();
const mounted = useMounted();
const fakeLoading = ref(false);
let fakeLoadingTimeout: number;
const eventsWrapper = useTemplateRef('eventsWrapperRef')
const { x, y, isScrolling, arrivedState, directions, measure} = useScroll(eventsWrapper, {
  behavior: 'smooth'
})
const { isSwiping, direction } = usePointerSwipe(eventsWrapper, {
  threshold: 100,
  disableTextSelect: props.compactMode ? true : false
})

// Navigation is "prepared" on pointerdown of an event and only committed on
// pointerup if no swipe happened during the gesture. This lets the user swipe
// the horizontal events carousel without triggering a navigation.
const pendingEventId = ref<number | null>(null)
// Tracked separately because `isSwiping` resets to false on pointerup, which
// would race with the pointerup that commits the navigation.
let swipeDetectedDuringGesture = false;

watch(isSwiping, (swiping) => {
  if (swiping) {
    swipeDetectedDuringGesture = true;
    pendingEventId.value = null;

    // Fired once per swipe (isSwiping only flips false -> true a single time
    // per gesture), so the carousel advances exactly one page per swipe.
    if (direction.value === 'left' || direction.value === 'right') {
      scrollEvents(direction.value === 'left' ? 'right' : 'left')
    }
  }
})

const route = useRoute()
const query = route.query
const parsedQueryYear = parseInt(query.year as string)
const parsedQueryMonth = parseInt(query.month as string)
const parsedQueryId = parseInt(query.id as string)
const parsedQueryFilter = parseInt(query.filter as string)
let initialScrollAtDone = false;

let left = 0;

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

// Reset every filter and apply only the category id present in the query string
// (mirrors the state the component would have on a fresh mount).
const applyQueryFilter = (filterValue: number) => {
  activeFilters.value = [];
  avecInscriptionFilterActive.value = false;
  sansInscriptionFilterActive.value = false;

  // If the query contains a `filter` key matching a real category id, apply it
  if (!isNaN(filterValue) && categories.value?.some(cat => cat.id === filterValue)) {
    activeFilters.value = [filterValue];
  }
}

// When the `filter` query param changes (e.g. navigating to the calendar from
// another page with a different category), reset all filters and apply only the
// one now in the query string — as if the component had just mounted.
watch(() => route.query.filter, (newFilter) => {
  applyQueryFilter(parseInt(newFilter as string));
}, {immediate: true});

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
  if (fakeLoading.value) return;

  clearTimeout(fakeLoadingTimeout)
  fakeLoading.value = true;
  fakeLoadingTimeout = setTimeout(() => {
    fakeLoading.value = false;
    if (activeFilters.value.includes(categoryId)) {
      activeFilters.value = activeFilters.value.filter(id => id !== categoryId);
    } else {
      activeFilters.value.push(categoryId);
    }
  }, 500)
}

const toggleInscriptionFilter = () => {
  if (fakeLoading.value) return;

  clearTimeout(fakeLoadingTimeout)
  fakeLoading.value = true;
  fakeLoadingTimeout = setTimeout(() => {
    fakeLoading.value = false;
    sansInscriptionFilterActive.value = !sansInscriptionFilterActive.value
  }, 500)
}

const removeFilters = () => {
  if (fakeLoading.value || activeFilters.value.length == 0) return;

  clearTimeout(fakeLoadingTimeout)
  fakeLoading.value = true;
  fakeLoadingTimeout = setTimeout(() => {
    fakeLoading.value = false;
    activeFilters.value = [];
    avecInscriptionFilterActive.value = false;
    sansInscriptionFilterActive.value = false;
  }, 500)
}

const getFilterTitlePrefix = (active: boolean): string => {
  if (locale.value === 'fr') {
    return active ? 'Retirer le filtre: ' : 'Ajouter le filtre: ';
  } else {
    return active ? 'Remove filter: ' : 'Add filter: ';
  }
}

const navigateToEvent = (id: number) => {
  navigateTo({ name: 'Calendrier', query: { id, month: displayMonth.value, year: displayYear.value } })
}

// Called on an event's pointerdown: arm the navigation for this gesture.
const prepareNavigateToEvent = (id: number) => {
  swipeDetectedDuringGesture = false;
  pendingEventId.value = id;
}

// Called on pointerup over the events area: navigate only if the gesture
// wasn't a swipe.
const commitNavigateToEvent = () => {
  const id = pendingEventId.value;
  pendingEventId.value = null;
  if (id === null || swipeDetectedDuringGesture) return;
  navigateToEvent(id);
}

watch([evenementsPending, mounted], (newVal) => {
  if (!newVal[0] && newVal[1] && parsedQueryId) {
    // Wait for the DOM to update with the new events
    nextTick(() => {
      const eventElement = document.getElementById(parsedQueryId.toString());
      if (eventElement && !initialScrollAtDone) {
        setTimeout(() => {
          const eventElement = document.getElementById(parsedQueryId.toString());
          eventElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 2000);
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

  if (earliestEvent) {
    const eventElement = document.getElementById(earliestEvent.toString());
    eventElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    highLightTimeout = setTimeout(() => {
      eventsRefs.value.forEach((e) => e.highlight(ids))
    }, 500)
  }
}

const scrollEvents = (direction: 'left' | 'right') => {
  const clientWidth = eventsWrapper.value?.clientWidth;
  
  if(!clientWidth) return;

  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

  if(direction == 'right' && !arrivedState.right){
    left += clientWidth + rem;
  }
  if(direction == 'left' && !arrivedState.left){
    left -= clientWidth + rem;
  }

  x.value = left
}

const resetScrollEvents = () => {
  left = 0;
  x.value = left;
}

watch([displayMonth, displayYear], () => {
  clearTimeout(fakeLoadingTimeout)
  fakeLoading.value = true;
  fakeLoadingTimeout = setTimeout(() => {
    fakeLoading.value = false;
    evenementsRefresh();
  }, 500)
})

watch(activeBreakpoint, ()=>{
  resetScrollEvents();
})

onMounted(() => {
  //** Maybe only fetch the events when mounted?? */
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
          @click.prevent="toggleInscriptionFilter" :aria-label="locale == 'fr' ?
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
      <div id="calendar-widget-wrapper" v-if="activeBreakpoint == 'small' && compactMode || !compactMode">
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
      <Transition name="events-wrapper-fade" appear @after-enter="() => { measure(); resetScrollEvents()}">
        <div class="events-wrapper" v-show="!fakeLoading && !evenementsPending"
          :class="{ compact: compactMode }">
          <div class="events-nav" v-if="compactMode">
            <button class="nav-btn previous" @click="scrollEvents('left')"
              :aria-label="locale == 'fr' ? 'Défiler les évènements' : 'Scroll events'"
              :title="locale == 'fr' ? 'Défiler les évènements' : 'Scroll events'" :class="{inactive: arrivedState.left}">
              <SvgSideArrow :color="colors['light-black']" />
            </button>
            <button class="nav-btn next" @click="scrollEvents('right')" :aria-label="locale == 'fr' ? 'Défiler les évènements' : 'Scroll events'"
              :title="locale == 'fr' ? 'Défiler les évènements' : 'Scroll events'" :class="{inactive: arrivedState.right}">
              <SvgSideArrow :color="colors['light-black']" />
            </button>
          </div>
          <div ref="eventsWrapperRef" name="event-card-fade" id="calendar-events" v-if="fileteredEvenements.length"
            :class="{ compact: compactMode }" @pointerup="commitNavigateToEvent" @pointercancel="pendingEventId = null">
            <CalendarEvent v-for="evenement in fileteredEvenements" ref="eventsRefs" :key="evenement.id"
              :event="evenement" :compact="compactMode" :categories="categories" @go-to-event="prepareNavigateToEvent" />
          </div>
          <p v-else class="no-events">{{ calendrier?.pas_devenements_message }}</p>
        </div>
      </Transition>
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

.month-nav, .events-nav {
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

    transition: opacity .5s ease-in-out;

    &.inactive{
      opacity: 0.4;
      pointer-events: none;
    }

    svg {
      height: .975rem;
      width: auto;
    }

    &.previous {
      transform: rotate(180deg);
    }

    @media screen and (hover: hover) {
      &:hover {
        :deep(svg) {
          fill: $brown !important;
        }
      }
    }
  }
}

.events-nav{
  margin-bottom: 1rem;
  width: 100%;
  justify-content: space-between;
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

      color: $light-black!important;

      font-weight: 600;
      font-size: .75rem;
      padding: .25rem .5rem;
      border: 1px solid transparent;
      border-radius: 2.5rem;

      cursor: pointer;

      transition: border-color 0.5s ease-in-out;

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

#calendar-widget-wrapper {
  display: flex;
  justify-content: center;

  flex-shrink: 0;

  // Stay in view while the (taller) events column scrolls past. Sticky
  // naturally stops at the bottom of #calendar-body, so it never leaves
  // its container. align-self: flex-start prevents the flex item from
  // stretching to the row's full height (which would defeat sticking).
  position: sticky;
  top: 1rem;
  align-self: flex-start;

  @media screen and (max-width: $small-breakpoint) {
    // #calendar-body is a column here and the widget is hidden, so don't stick.
    position: static;
    align-self: center;
  }
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

.events-wrapper {
  width: 100%;
  //transition: opacity .5s ease-in-out;

  position: relative;

  &.loading {
    opacity: 0.4;
    pointer-events: none;

    * {
      pointer-events: none;
    }
  }

  .nav-btn{
    &.inactive{
      opacity: .4;
      pointer-events: none;
    }
  }

  /*  &.compact {
    width: 100vw;

    padding: $content-block-padding-large;
    padding-top: 0px;
    padding-bottom: 0px;
    margin: 0 auto;

    position: relative;

    @media screen and (max-width: $medium-breakpoint) {
      padding: $content-block-padding-medium;
      padding-top: 0px;
      padding-bottom: 0px;
    }

    @media screen and (max-width: $small-breakpoint) {
      padding: $content-block-padding-small;
      padding-top: 0px;
      padding-bottom: 0px;
    }
  } */
}

#calendar-events {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 100%;

  &.compact {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;

    gap: 0rem;

    overflow: hidden;

    /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    }

    //grid-template-columns: repeat(3, 1fr);

    @media screen and (max-width: $medium-breakpoint) {
      //grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: $small-breakpoint) {
      //grid-template-columns: repeat(1, 1fr);
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