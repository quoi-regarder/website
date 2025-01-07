<template>
  <Html :lang="htmlAttrs.lang" :dir="htmlAttrs.dir">
    <Body>
      <template v-if="!isAuth">
        <NavBar />
      </template>
      <slot />

      <template v-if="!isAuth">
        <Footer />
      </template>
    </Body>
  </Html>
</template>

<script setup lang="ts">
const { t } = useI18n()
const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})

useHead({
  titleTemplate: `%s - ${t('seo.name')}`
})
const htmlAttrs = computed(() => head.value.htmlAttrs)
const route = useRoute()

const isAuth = computed(() => route.path.includes('/auth'))
</script>
