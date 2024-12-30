<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <Title>{{ $t('seo.title') }}</Title>
      <template v-for="link in head.link" :key="link.hid">
        <Link :id="link.hid" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
      </template>
      <template v-for="meta in head.meta" :key="meta.hid">
        <Meta :id="meta.hid" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <UNotifications />

      <Analytics />
      <SpeedInsights />
    </Body>
  </Html>
</template>

<script lang="ts" setup>
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
const { locale } = useI18n()

const currentLocale = computed(() => locale.value || 'en-US')

const head = useLocaleHead({
  seo: true,
  dir: true,
  lang: true
})

useHead(() => ({
  htmlAttrs: {
    lang: head.value.htmlAttrs?.lang || currentLocale.value,
    dir: head.value.htmlAttrs?.dir || 'ltr'
  },
  link: [...(head.value.link || [])],
  meta: [...(head.value.meta || [])]
}))
</script>

<style>
body {
  font-family: 'Lexend', serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: normal;
}
</style>
