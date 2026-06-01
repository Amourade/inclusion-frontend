export function useParseLink(
  link?: string
): ComputedRef<{ path?: string; hash?: string, href?: string, target?: string }> {
  return computed(() => {
    const router = useRouter()
    const knownRoutes = router.getRoutes()
        .filter(r => !r.path.includes(':')) // Exclude dynamic routes
        .map(r => r.path)

    const href = link
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return { href }

    let path: string | undefined
    let hash: string | undefined

    // Check if it's a full URL
    if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
            const url = new URL(href)
            const currentOrigin = useRuntimeConfig().public.domain

            // If not same origin, let the browser handle it normally
            if (url.origin !== currentOrigin) {
                return {href, target: '_blank'}
            }

            // Extract path from same-origin URL
            path = url.pathname
            hash = url.hash
        } catch {
            return { href, target: '_blank' } // Invalid URL, let browser handle
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

    if (!path) {
        return { href, target: '_blank' }
    }

    if (knownRoutes?.includes(path)) {
        return { path, hash, target: '_self' }
    } else {
        return { href, target: '_blank' }
    }
});
}
