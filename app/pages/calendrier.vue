<script lang="ts" setup>
import CalendarMaster from '~/components/calendrier/calendarMaster.vue';


definePageMeta({
  name: 'Calendrier',
  title: 'Nous joindre - Inclusion Montréal'
});
</script>

<template>
  <CalendarMaster :compact-mode="false" />
</template>

<style>

</style>