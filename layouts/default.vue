<template>
  <Html :lang="htmlAttrs.lang" :dir="htmlAttrs.dir">
    <Body>
      <template v-if="!isAuth">
        <Navbar
          class="fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-40 bg-[var(--ui-bg)]/60"
        />
      </template>
      <div :class="[isAuth ? 'mt-0' : 'mt-20']">
        <slot />
      </div>
      <template v-if="!isAuth">
        <Footer />
      </template>
      <ClientOnly>
        <PopinFeaturePromo
          v-show="showFeaturePromo"
          class="transition-all duration-1000 transform translate-y-full"
          :class="{ 'translate-y-0': showFeaturePromo }"
        />
      </ClientOnly>
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
const showPromo = ref(false)

onMounted(() => {
  setTimeout(() => {
    showPromo.value = true
  }, 20_000)
})

const showFeaturePromo = computed(() => {
  if (isAuth.value || authStore?.isAuthenticated || !showPromo.value) {
    return false
  }
  return !featurePromoStore.getHasSeenPromo
})
</script>
