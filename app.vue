<template>
  <UApp :locale="locales[locale]" :tooltip="{ delayDuration: 200 }">
    <NuxtLayout>
      <NuxtPage />
      <ClientOnly>
        <CookieControl :locale="formatLocale(locale)" />
        <PopinOnboardingGuide :force-open="false" />
      </ClientOnly>
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()

onMounted(() => {
  useMovieFavoriteChannel()
  useSerieFavoriteChannel()
  useMovieListChannel()
  useSerieListChannel()
})

const formatLocale = (locale: string) => {
  switch (locale) {
  case 'fr':
    return 'fr'
  case 'us':
    return 'en'
  }
}
</script>
