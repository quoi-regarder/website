<template>
  <UContainer class="py-4 gap-y-4 min-h-[75vh]">
    <UTabs v-model="active" :items="tabs" variant="pill" @update:model-value="updateUrl">
      <template #profile>
        <Profile />
      </template>
      <template #movies>
        <ProfileMovie />
      </template>
      <template #series>
        <ProfileSeries />
      </template>
    </UTabs>
  </UContainer>
</template>

<script lang="ts" setup>
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

useHead({
  title: t('seo.pages.profile'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.descriptions.profile') }]
})

definePageMeta({
  middleware: ['auth']
})

const tabs = computed(() => [
  {
    label: t('profile.tabs.profile'),
    icon: 'i-lucide-user',
    slot: 'profile'
  },
  {
    label: t('profile.tabs.movies'),
    icon: 'i-lucide-clapperboard',
    slot: 'movies'
  },
  {
    label: t('profile.tabs.series'),
    icon: 'i-lucide-tv-minimal-play',
    slot: 'series'
  }
])

onMounted(() => {
  const initialTabIndex = tabs.value.findIndex((tab) => tab.slot === route.query.tab)
  active.value = String(initialTabIndex !== -1 ? initialTabIndex : 0)
})

const active = ref('0')

const updateUrl = (newTabIndex: string | number) => {
  const index = Number(newTabIndex)
  const tab = tabs.value[index]
  router.push({ query: { tab: tab.slot } })
}

watchEffect(() => {
  const index = tabs.value.findIndex((tab) => tab.slot === route.query.tab)
  active.value = String(index !== -1 ? index : 0)
})
</script>
