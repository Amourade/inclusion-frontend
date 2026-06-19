<script lang="ts" setup>
definePageMeta({
  name: '404',
});

useSeoMeta({
    author: 'Projet Inclusion',
    title: '404'
})

const locale = useI18n();
</script>
<template>
  <div class="page-wrapper">
    <GlobalSection id="error">
      <p class="medium-body-text">{{ locale == 'fr' ? 'Oops, il n\'y a rien ici.' : 'Oops, there\'s nothing here.' }}</p>
    </GlobalSection>
  </div>
</template>
<style lang="scss" scoped>
#error{
  min-height: 100%;
  background-color: $white;
  flex-grow: 1;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>