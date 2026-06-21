import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if(to.name == from.name && to.name !== 'Calendrier' && to.name !== 'ProjetsConcertes') return false;
    if(to.name == 'Calendrier' && from.name == 'Calendrier') return {
      top: 0,
      behavior: 'smooth'
    }
    if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition)
        }, 750) // Small delay for DOM to update
      })
    }
    
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth'
          })
        }, 752) // Small delay for DOM to update
      })
    }

    // Quick fix, don't scroll to top if there's an id in the query string
    // It's because the page will consume the id to scroll somewhere
    if(to.query["id"]) return false

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          top: 0
        })
      }, 750) // Small delay for DOM to update
    })
  }
}