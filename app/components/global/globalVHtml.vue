<script setup lang="ts">
defineProps({
    html: {
        type: String,
        required: false
    }
})

const router = useRouter()
const knownRoutes = computed(() =>
    router.getRoutes()
        .filter(r => !r.path.includes(':')) // Exclude dynamic routes
        .map(r => r.path)
)

const handleClick = async (e: PointerEvent) => {
    const target = e.target as Element | null
    const anchor = target?.closest('a')
    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || anchor.getAttribute('target') === '_blank') return

    let path: string | undefined
    let hash: string | undefined

    // Check if it's a full URL
    if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
            const url = new URL(href)
            const currentOrigin = useRuntimeConfig().public.domain

            // If not same origin, let the browser handle it normally
            if (url.origin !== currentOrigin) return

            // Extract path from same-origin URL
            path = url.pathname
            hash = url.hash
        } catch {
            return // Invalid URL, let browser handle
        }
    } else {
        // Relative path
        const hashIndex = href.indexOf('#')
        if (hashIndex !== -1) {
            hash = href.slice(hashIndex)
            path = href.slice(0, hashIndex).split('?')[0]
        } else {
            path = href.split('?')[0]
        }
    }

    if (!path) return

    if (knownRoutes.value?.includes(path)) {
        e.preventDefault()
        await navigateTo({ path: path, hash: hash })
    }
}
</script>
<template>
    <div v-if="html" @click="handleClick" v-html="html" />
</template>
<style lang="scss" scoped></style>