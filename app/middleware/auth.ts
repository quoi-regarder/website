export default defineNuxtRouteMiddleware(() => {
  const localePath = useLocalePath()
  const tokenCookie = useCookie('auth').value

  if (!tokenCookie || tokenCookie?.token === null) {
    return navigateTo(localePath('/auth/login'))
  }
})
