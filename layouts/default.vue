<template>
  <Html :lang="htmlAttrs.lang" :dir="htmlAttrs.dir">
    <Body>
      <template v-if="!isAuth">
        <Navbar
          class="fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-40 bg-[var(--ui-bg)]/60"
        />
        <ClientOnly>
          <PopinFeaturePromo />
        </ClientOnly>
      </template>
      <div :class="[isAuth ? 'mt-0' : 'mt-20', showFeaturePromo ? 'pb-32' : '']">
        <slot />
      </div>
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

const featurePromoStore = useFeaturePromoStore()
const authStore = useAuthStore()

const showFeaturePromo = computed(() => {
  if (isAuth.value || authStore?.isAuthenticated) {
    return false
  }
  return !featurePromoStore.getHasSeenPromo
})
</script>
