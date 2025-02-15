<template>
  <div class="relative flex flex-col gap-y-8">
    <HomeBackToTopButton :show-button="showButton" />

    <HomeBackground />

    <HomeHeader />

    <HomeCarousel v-model:genres="genres" />

    <HomeFilters v-model:genres="genres" @update:more-filters="moreFilters = $event" />

    <HomeMoreFilters v-model:more-filters="moreFilters" />

    <HomeFooter />
  </div>
</template>

<script lang="ts" setup>
const authService = useAuthService()
const localPath = useLocalePath()
const { t } = useI18n()
const route = useRoute()

useHead({
  title: t('seo.title'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.description') }]
})

const genres = ref<Option[]>([])

const moreFilters = ref(false)
const showButton = ref(false)

onMounted(() => {
  handleRegisterToken()

  window.addEventListener('scroll', checkSearchButtonVisibility)
})

const checkSearchButtonVisibility = () => {
  const searchButton = document.getElementById('searchButton')
  if (searchButton) {
    const rect = searchButton.getBoundingClientRect()
    showButton.value = rect.top < 0 || rect.bottom > window.innerHeight
  }
}

const handleRegisterToken = async () => {
  const token = route.query.token
  if (!token) return
  const response: ApiResponse = await authService.verifyEmail(token as string)

  if (response.status === 'error') {
    navigateTo(localPath('/'))
    return
  }

  await navigateTo(localPath('/'))
  useNotifications().success(t('common.toasts.title.success'), t('home.toasts.success.token'))
}
</script>
