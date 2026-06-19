<script lang="ts" setup>
import CalendarMaster from '~/components/calendrier/calendarMaster.vue';

definePageMeta({
  name: 'Calendrier',
});

useSeoMeta({
    author: 'Projet Inclusion',
    title: 'Calendrier'
})
</script>

<template>
  <div class="page-wrapper">
    <CalendarMaster :compact-mode="false" />
  </div>
</template>

<style>

</style>