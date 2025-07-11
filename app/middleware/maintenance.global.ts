export default defineNuxtRouteMiddleware((to) => {
  const runtimeConfig = useRuntimeConfig()
  const localePath = useLocalePath()

  const maintenance = runtimeConfig.public.maintenance

  if (!maintenance && to.path === localePath('/maintenance')) {
    return navigateTo(localePath('/'))
  }

  if (maintenance && to.path !== localePath('/maintenance')) {
    return navigateTo(localePath('/maintenance'))
  }
})
