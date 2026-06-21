<script setup lang="ts">
const props = defineProps<{
    link: string,
    color?: string
}>()
const emits = defineEmits<{
    (e: 'active', value: boolean): void
}>()
const parsedLink = useParseLink(props.link)

console.log(parsedLink.value)
</script>
<template>
    <NuxtLink :to="parsedLink" :external="parsedLink.target === '_blank'" :target="parsedLink.target" :class="{ external: parsedLink.target === '_blank' }">
        <slot />
        <SvgDownArrow v-if="parsedLink.target === '_blank'" class="menu-arrow" :color="color" />
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