export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as AuthAccessToken | null,
    user_id: null as string | null,
    user_email: null as string | null
  }),
  getters: {
    getToken: (state) => state.token?.token,
    getExpiresAt: (state) => state.token?.expiresAt,
    getUserId: (state) => state.user_id,
    getUserEmail: (state) => state.user_email,
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    setAuth (data: any) {
      this.token = data.token as AuthAccessToken
      this.user_id = data.user.id
      this.user_email = data.user.email
    },
    resetAuth () {
      this.token = null
      this.user_id = null
      this.user_email = null
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true
    })
  }
})
