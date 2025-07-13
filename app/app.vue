<template>
  <UApp :locale="locales[locale]" :tooltip="{ delayDuration: 200 }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <CookieControl :locale="locale" />
      <PopinOnboardingGuide :force-open="false" />
    </ClientOnly>
  </UApp>
</template>

<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
</script>
