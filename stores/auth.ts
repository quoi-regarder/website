export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user_id: null as string | null,
    user_email: null as string | null,
    onboarding: false as boolean
  }),
  getters: {
    getToken: (state) => state.token,
    getUserId: (state) => state.user_id,
    getUserEmail: (state) => state.user_email,
    isAuthenticated: (state) => !!state.token,
    isOnboarding: (state) => state.onboarding
  },
  actions: {
    setAuth (data: any) {
      this.token = data.token
      this.user_id = data.user.id
      this.user_email = data.user.email
      this.onboarding = data.user.onboarding
    },
    resetAuth () {
      this.token = null
      this.user_id = null
      this.user_email = null
      this.onboarding = false
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true
    })
  }
})
