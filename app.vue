<template>
  <UApp :locale="locales[locale]" :tooltip="{ delayDuration: 200 }">
    <NuxtLayout>
      <NuxtPage />
      <ClientOnly>
        <CookieControl :locale="formatLocale(locale)" />
      </ClientOnly>
      <PopinOnboardingGuide v-if="showOnboarding" @onboarding-finished="showOnboarding = false" />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
const showOnboarding = ref(true)

useMovieFavoriteChannel()
useSerieFavoriteChannel()
useMovieListChannel()
useSerieListChannel()

const formatLocale = (locale: string) => {
  switch (locale) {
  case 'fr':
    return 'fr'
  case 'us':
    return 'en'
  }
}
</script>
