export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuthStore()
  const localePath = useLocalePath()

  if (!isAuthenticated.value) {
    return navigateTo(localePath('/auth/login'))
  }
})
