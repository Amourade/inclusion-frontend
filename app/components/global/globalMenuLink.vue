<script setup lang="ts">
const props = defineProps<{
    link: string,
    color?: string
}>()
const emits = defineEmits<{
    (e: 'active', value: boolean): void
}>()
const route = useRoute()
const parsedLink = useParseLink(props.link)

const isActive = computed(() => {
    if (parsedLink.value === undefined || typeof parsedLink.value === 'string') return false
    return route.path === parsedLink.value.path
})

watch(isActive, (newValue) => {
    emits('active', newValue)
}, {
    immediate: true
})
</script>
<template>
    <NuxtLink :to="parsedLink" :class="{ external: parsedLink.target === '_blank' }">
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