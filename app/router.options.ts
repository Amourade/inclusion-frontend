import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if(to.name == from.name) return false;

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
        }, 2000) // Small delay for DOM to update
      })
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          top: 0
        })
      }, 750) // Small delay for DOM to update
    })
  }
}