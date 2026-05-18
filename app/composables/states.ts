export const useColors = () => {
    return useState<SiteColors>('colors',  () => {
        return {
            'black': '#1E1E1E',
            'light-black': '#1A202C',
            'very-light-pink': '#FFB3FD4D',
            'light-pink': '#FFB3FDB2',
            'pink': '#FFB3FD',
            'very-light-orange': '#E1AE774D',
            'light-orange': '#E1AE77B2',
            'orange': '#E1AE77',
            'brown': '#663E3D',
            'light-grey': '#F5F5F5',
            'dark-grey': '#D9D9D9',
            'blue': '#CEE4F4',
            'green': '#EBFDE966',
            'white': '#FFFFFF',
            'neon-pink': '#F25D7A',
            'yellow': '#E1AE77'
        }
    })
}

export const useBreakpointsValues = () => {
    return useState('breakpointsValues', () => {
        return {
            small: 0,
            medium: 768,
            large: 1024
        }
    })
}