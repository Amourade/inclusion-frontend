<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core';

interface Props {
  year: number
  month: number // 1-indexed (1 = January, 12 = December)
  events?: Array<Evenement>
  canGoPrevious?: boolean
  canGoNext?: boolean
}

const colors = useColors();
const props = withDefaults(defineProps<Props>(), {
  canGoPrevious: true,
  canGoNext: true,
})
const locale = useI18n()

const emit = defineEmits<{
  'update:year': [year: number]
  'update:month': [month: number]
  'highlightEvents': [ids: number[]]
}>()

const displayYear = ref(props.year)
const displayMonth = ref(props.month)

const daysOfWeek = {
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

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

interface CalendarDay {
  date: number
  currentMonth: boolean
  isToday: boolean
  events: Array<number>
}

const calendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = []
  const today = new Date()

  const firstDayOfMonth = new Date(displayYear.value, displayMonth.value - 1, 1)
  const lastDayOfMonth = new Date(displayYear.value, displayMonth.value, 0)

  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Previous month days
  const prevMonth = new Date(displayYear.value, displayMonth.value - 1, 0)
  const daysInPrevMonth = prevMonth.getDate()

  // Days of the previous month
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      currentMonth: false,
      isToday: false,
      events: []
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      i === today.getDate() &&
      displayMonth.value === today.getMonth() + 1 &&
      displayYear.value === today.getFullYear()

    const dayEvents = props.events?.filter(event => {
      const eventDate = event.date.split('-').map(Number) // [year, month, day]
      return (
        eventDate[2] === i &&
        eventDate[1] === displayMonth.value &&
        eventDate[0] === displayYear.value
      )
    }).map(event => event.id as number)

    days.push({
      date: i,
      currentMonth: true,
      isToday,
      events: dayEvents ? dayEvents : []
    })
  }

  // Next month days (fill remaining cells to complete the grid)
  const remainingCells = 42 - days.length // 6 rows × 7 days
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: i,
      currentMonth: false,
      isToday: false,
      events: []
    })
  }

  return days
})

function previousMonth() {
  if (!props.canGoPrevious) return;

  if (displayMonth.value === 1) {
    displayMonth.value = 12
    displayYear.value--
    emit('update:year', displayYear.value)
  } else {
    displayMonth.value--
  }
  emit('update:month', displayMonth.value)
}

function nextMonth() {
  if (!props.canGoNext) return;

  if (displayMonth.value === 12) {
    displayMonth.value = 1
    displayYear.value++
    emit('update:year', displayYear.value)
  } else {
    displayMonth.value++
  }
  emit('update:month', displayMonth.value)
}

watch(() => props.year, (newYear) => {
  displayYear.value = newYear
})

watch(() => props.month, (newMonth) => {
  displayMonth.value = newMonth
})
</script>
<template>
  <GlobalCard class="calendar-widget">
    <div class="calendar-header">
      <button class="nav-btn previous" @click="previousMonth" :disabled="!canGoPrevious"
        :class="{ inactive: !canGoPrevious }" aria-label="Mois précédent">
        <SvgSideArrow :color="colors['brown']" />
      </button>
      <span class="current-month">{{ monthName }} {{ displayYear }}</span>
      <button class="nav-btn next" @click="nextMonth" :disabled="!canGoNext" :class="{ inactive: !canGoNext }"
        aria-label="Mois suivant">
        <SvgSideArrow :color="colors['brown']" />
      </button>
    </div>
    <div class="calendar-grid">
      <div v-for="day in daysOfWeek[locale]" :key="day" class="day-header">
        {{ day }}
      </div>
      <div v-for="(day, index) in calendarDays" :key="index" class="day-cell" :class="{
        'other-month': !day.currentMonth,
        'today': day.isToday,
        'has-events': day.events.length > 0
      }" @click="emit('highlightEvents', day.events)">
        {{ day.date }}
      </div>
    </div>
  </GlobalCard>
</template>
<style scoped lang="scss">
.calendar-widget {
  width: 100%;
  //max-width: 350px;
  font-family: 'Inter', sans-serif;

  flex-shrink: 0;

  gap: 2rem;

  background-color: $cream;
  color: $brown;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem;

  width: 100%;

  .current-month {
    font-size: 1.125rem;
    line-height: 120%;
    font-weight: 600;
  }

  .nav-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: $brown;

    flex-shrink: 0;

    transition: opacity .5s ease-in-out;

    &.inactive {
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

    @media screen and (hover: hover){
      &:hover{
        :deep(svg){
          fill: $light-black;
        }
      }
    }
  }
}


.current-month {
  font-weight: 600;
  font-size: 1.1rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-header {
  text-align: center;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.5rem;

  @media screen and (max-width: $medium-breakpoint) {
    padding: 0.3rem;
  }
  //color: $black;
}

.day-cell {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.5s ease-in-out;

  @media screen and (max-width: $medium-breakpoint) {
    padding: 0.3rem;
  }

  @media screen and (hover: hover){
    &:hover {
      background-color: $light-grey;
    }
  }

  &.other-month {
    color: $dark-grey;
  }

  &.has-events {
    background-color: $orange;
    color: $light-black;
    font-weight: 600;

    @media screen and (hover: hover){
      &:hover {
        background-color: $light-orange;
      }
    }
  }
}
</style>