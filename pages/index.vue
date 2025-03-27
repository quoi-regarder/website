<template>
  <div class="relative flex flex-col gap-y-8">
    <div
      class="bg-white/85 dark:bg-black/82 min-h-[93.5vh] w-full bg-[url('/img/background.webp')] bg-blend-overlay bg-cover bg-center bg-no-repeat absolute z-0"
    />

    <div class="relative z-10 min-h-[90vh] flex flex-col py-12">
      <div class="flex-none">
        <HomeHeader />
      </div>

      <div class="flex-none mt-8">
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

      <div class="flex-1 flex items-center">
        <HomeSearch class="w-full" />
      </div>
    </div>

    <HomeCarousel v-model:genres="genres" />
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
