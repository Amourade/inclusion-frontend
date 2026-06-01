<script setup lang="ts">
const props = defineProps<{
    link?: string
}>()

const parsedLink = useParseLink(props.link)
</script>
<template>
    <NuxtLink :to="parsedLink">
        <slot />
    </NuxtLink>
</template>