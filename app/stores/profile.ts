export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null as Profile | null
  }),
  getters: {
    getProfile: (state) => state.profile
  },
  actions: {
    setProfile (profile: Profile) {
      this.profile = profile
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true
    })
  }
})
