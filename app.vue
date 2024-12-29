<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />

    <Analytics />
    <SpeedInsights />
  </div>
</template>

<script lang="ts" setup>
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
</script>

<style>
body {
  font-family: 'Lexend', serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: normal;
}
</style>
