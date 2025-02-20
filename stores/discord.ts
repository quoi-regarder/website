export const useDiscordStore = defineStore('discord', {
  state: () => ({
    showPopin: true
  }),
  getters: {
    getShowPopin: (state) => state.showPopin
  },
  actions: {
    setShowPopin (value: boolean) {
      this.showPopin = value
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true
    })
  }
})
