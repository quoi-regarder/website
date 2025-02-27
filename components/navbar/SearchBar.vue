<template>
  <UButtonGroup orientation="horizontal" class="w-full">
    <UInput
      ref="input"
      v-model="searchQuery"
      size="xl"
      icon="i-lucide:search"
      color="primary"
      :placeholder="$t('navbar.search.placeholder')"
      class="w-full"
      variant="subtle"
      @keydown.enter="handleSearch"
    />
    <UButton
      icon="i-lucide:clapperboard"
      :label="$t('navbar.search.movies')"
      color="secondary"
      :variant="activeSearch === 'movie' ? 'solid' : 'outline'"
      size="xl"
      @click="handleChangeActiveSearch('movie')"
    >
      <template #trailing>
        <UKbd value="m" />
      </template>
    </UButton>
    <UButton
      icon="i-lucide:tv-minimal-play"
      :label="$t('navbar.search.tv')"
      color="secondary"
      :variant="activeSearch === 'tv' ? 'solid' : 'outline'"
      size="xl"
      @click="handleChangeActiveSearch('tv')"
    >
      <template #trailing>
        <UKbd value="t" />
      </template>
    </UButton>
  </UButtonGroup>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const input = useTemplateRef('input')
const searchQuery = ref('')
const activeSearch = ref<'movie' | 'tv'>('movie')

const debouncedSearch = useDebounceFn(() => {
  if (!searchQuery.value.trim()) return
  navigateSafely(`/search?query=${searchQuery.value}&type=${activeSearch.value}`)
}, 750)

defineShortcuts({
  m: () => {
    handleChangeActiveSearch('movie')
    input.value?.inputRef?.focus()
  },
  t: () => {
    handleChangeActiveSearch('tv')
    input.value?.inputRef?.focus()
  }
})

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  navigateSafely(`/search?query=${searchQuery.value}&type=${activeSearch.value}`)
}

const handleChangeActiveSearch = (type: 'movie' | 'tv') => {
  activeSearch.value = type

  if (searchQuery.value.trim()) {
    navigateSafely(`/search?query=${searchQuery.value}&type=${type}`)
  }
}

const navigateSafely = (path: string) => {
  if (
    route.fullPath !== localePath(path) &&
    decodeURIComponent(route.fullPath) !== decodeURIComponent(path)
  ) {
    router.push(localePath(path))
  }
}

watch(searchQuery, () => debouncedSearch())
</script>
