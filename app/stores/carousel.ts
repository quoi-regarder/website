export const useCarouselStore = defineStore('carousel', {
  state: () => ({
    currentIndex: 0
  }),
  actions: {
    setCurrentIndex (index: number) {
      this.currentIndex = index
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: 'strict',
      secure: true
    })
  }
})
