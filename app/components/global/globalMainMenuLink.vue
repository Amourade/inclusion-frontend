<script setup lang="ts">
</script>
<template>
    <NuxtLink class="main-link">
        <slot />
    </NuxtLink>
</template>
<style lang="scss" scoped>
.main-link{
    color: $black;
    font-size: 1rem;
    font-family: "inter", sans-serif;
    font-weight: 400;
    line-height: 100%;
    

    white-space: nowrap;
    border: 1px solid transparent;
    border-radius: 20px;

    transition: border-color 0.3s ease;

    display: inline-block;

    display: flex;
    align-items: center;
    flex-shrink: 0;
    flex-direction: row;
    gap: .3rem;

    padding: .5rem .5rem;

    @media screen and (hover: hover) {
        &.nuxt-link-active {
            border-color: $black;
        }
    }

    @media screen and (max-width: $small-breakpoint) {
        color: $brown;
    }
}
</style>