export function useParseLink(
  link?: string
): ComputedRef<{ path?: string; hash?: string, href?: string, target?: string, query?: {[key:string]: string} } | string> {
  return computed(() => {
    const router = useRouter()
    const knownRoutes = router.getRoutes()
        .filter(r => !r.path.includes(':')) // Exclude dynamic routes
        .map(r => r.path)

    const href = link
    if(!href) return "#"
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href

    let path: string | undefined
    let hash: string | undefined
    let query: {[key:string]: string} = {}

    // Check if it's a full URL
    if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
            const url = new URL(href)
            const currentOrigin = useRuntimeConfig().public.domain

            // If not same origin, let the browser handle it normally
            if (url.origin !== currentOrigin) {
                return href
            }

            // Extract path from same-origin URL
            path = url.pathname
            hash = url.hash
        } catch {
            return href // Invalid URL, let browser handle
        }
    } else {
        // Relative path
        const hashIndex = href.indexOf('#')
        let rawQuery: string = ""
        if (hashIndex !== -1) {
            hash = href.slice(hashIndex)
            const splitPath = href.slice(0, hashIndex).split('?')
            path = splitPath[0]
            if(splitPath[1]) rawQuery = splitPath[1]
        } else {
            const splitPath = href.split("?")
            path = splitPath[0]
            hash = ""
            if(splitPath[1]) rawQuery = splitPath[1]
        }

        if(rawQuery){
            const queryArguments = rawQuery.split("&")
            queryArguments.forEach((arg) => {
                const keyValueArray: string[] = arg.split("=")
                if(keyValueArray[0] && keyValueArray[1]) query[keyValueArray[0]] = keyValueArray[1]
            })
        }
    }

    if (!path) {
        return href
    }

    if (knownRoutes?.includes(path)) {
        return { path, hash, query }
    } else {
        return href
    }
});
}
