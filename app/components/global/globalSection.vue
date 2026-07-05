<script setup lang="ts">
const props = defineProps<{
    smallTitle?: string;
    bigTitle?: string;
}>();
</script>
<template>
    <section class="section">
        <div class="inner-section">
            <h2 v-if="smallTitle">{{ smallTitle }}</h2>
            <h3 class="big-title" v-if="bigTitle" v-html="bigTitle" />
            <slot />
        </div>
    </section>
</template>
<style lang="scss" scoped>
.section{
    position: relative;

    h2{
        margin-bottom: 3rem;
        font-weight: 500;
        font-size: 1.1rem;
        line-height: 120%;

        position: relative;
        z-index: 3;
    }
}

.inner-section{
    max-width: $large-breakpoint;
    padding: $content-block-padding-large;
    margin: 0 auto;

    position: relative;

    @media screen and (max-width: $medium-breakpoint) {
        padding: $content-block-padding-medium;
    }

    @media screen and (max-width: $small-breakpoint) {
        padding: $content-block-padding-small;
    }
}
</style>