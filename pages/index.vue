<template>
  <div class="relative flex flex-col gap-y-8">
    <div
      class="bg-white/85 dark:bg-black/82 min-h-[93.5vh] w-full bg-[url('/background.webp')] bg-blend-overlay bg-cover bg-center bg-no-repeat absolute z-0"
    />

    <div class="relative z-10 min-h-[90vh] flex flex-col py-12">
      <div class="flex-none home-header">
        <HomeHeader />
      </div>

      <div class="flex-none mt-8 home-filters">
        <HomeFilters v-model:genres="genres" v-model:more-filters="moreFilters" />
      </div>

      <div class="overflow-hidden flex-none">
        <transition
          enter-active-class="transition-opacity duration-500 ease-in-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-500 ease-in-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <HomeMoreFilters
            v-if="moreFilters"
            v-model:more-filters="moreFilters"
            class="w-full transform-gpu"
          />
        </transition>
      </div>

      <div class="flex-1 flex items-center home-search">
        <HomeSearch class="w-full" />
      </div>
    </div>

    <div class="home-carousel">
      <HomeCarousel v-model:genres="genres" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const authService = useAuthService()
const localPath = useLocalePath()
const { t, locale } = useI18n()
const route = useRoute()

useSeoMeta({
  title: t('seo.title'),
  description: t('seo.description'),
  ogTitle: t('seo.title'),
  ogDescription: t('seo.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  defineWebSite({
    name: t('seo.name'),
    description: t('seo.description'),
    inLanguage: locale.value
  }),
  defineWebPage({
    name: t('seo.title'),
    description: t('seo.description'),
    inLanguage: locale.value
  })
])

const genres = ref<Option[]>([])

const moreFilters = ref(false)

onMounted(() => {
  handleRegisterToken()
})

const handleRegisterToken = async () => {
  const token = route.query.token

  if (!token) return
  const response: ApiResponse<void> = await authService.verifyEmail(token as string)

  if (!response.success) {
    navigateTo(localPath('/'))
    return
  }

  await navigateTo(localPath('/'))
  useNotifications().success(t('common.toasts.title.success'), t('home.toasts.success.token'))
}
</script>
