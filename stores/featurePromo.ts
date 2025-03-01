export const useFeaturePromoStore = defineStore('feature_promo', {
  state: () => ({
    hasSeenPromo: false
  }),
  getters: {
    getHasSeenPromo: (state) => state.hasSeenPromo
  },
  actions: {
    markPromoAsSeen () {
      this.hasSeenPromo = true
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      secure: true
    })
  }
})
