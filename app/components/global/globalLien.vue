<script setup lang="ts">
defineProps({
    color: {
        type: String,
        required: false
    }
})

const colors = useColors();
</script>
<template>
    <NuxtLink>
        <span class="icon" :style="{backgroundColor: color ? color : colors.brown}">
            <slot name="icon" />
        </span>
        <slot name="text"/>
    </NuxtLink>
</template>
<style lang="scss" scoped>
a{
    font-size: .875rem;

    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .75rem;

    @media screen and (max-width: $medium-breakpoint) {
        font-size: 1rem;
    }

    @media screen and (max-width: $small-breakpoint) {
        font-size: 1rem;
    }
}

.icon{
    display: inline-flex;
    background: $brown;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    width: 2rem;
    height: 2rem;

    :deep(svg){
        width: .75rem;
        height: .75rem;

        @media screen and (max-width: $medium-breakpoint) {
            font-size: 1rem;
        }

        @media screen and (max-width: $small-breakpoint) {
            font-size: 1rem;
        }
    }
}
</style>