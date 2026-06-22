<script setup lang="ts">
const props = defineProps<{
    link: string,
    color?: string
}>()
const emits = defineEmits<{
    (e: 'active', value: boolean): void
}>()
const parsedLink = useParseLink(props.link)
</script>
<template>
    <NuxtLink :to="parsedLink" :external="typeof parsedLink == 'string'" :target="typeof parsedLink == 'string' ? '_blank' : '_self'" :class="{ external: typeof parsedLink == 'string' && parsedLink !== '#' }">
        <slot />
        <SvgDownArrow v-if="typeof parsedLink == 'string' && parsedLink !== '#'" class="menu-arrow" :color="color" />
    </NuxtLink>
</template>
<style lang="scss" scoped>
svg {
    width: .75rem;
    height: .75rem;
    flex-shrink: 0;
    rotate: 225deg;
}
</style>