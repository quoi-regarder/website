<template>
  <html>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />

    <Analytics />
    <SpeedInsights />
  </html>
</template>

<script lang="ts" setup>
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
const { t } = useI18n()

useHead({
  title: t('seo.title'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.description') }]
})
</script>

<style>
body {
  font-family: 'Lexend', serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: normal;
}
</style>
