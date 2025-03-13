export default defineNuxtRouteMiddleware((to) => {
  const runtimeConfig = useRuntimeConfig()
  const localePath = useLocalePath()

  if (
    Boolean(runtimeConfig.public.maintenance) === false &&
    to.path === localePath('/maintenance')
  ) {
    return navigateTo(localePath('/'))
  }

  if (
    Boolean(runtimeConfig.public.maintenance) === true &&
    to.path !== localePath('/maintenance')
  ) {
    return navigateTo(localePath('/maintenance'))
  }
})
