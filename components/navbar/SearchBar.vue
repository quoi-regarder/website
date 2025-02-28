<template>
  <UButtonGroup orientation="horizontal" class="w-full">
    <UInput
      ref="input"
      v-model="searchQuery"
      size="xl"
      color="primary"
      :placeholder="$t('navbar.search.placeholder')"
      class="w-full"
      variant="subtle"
      @keydown.enter="handleSearch"
      @keydown.escape="handleEscape"
    >
      <template #leading>
        <UIcon
          v-if="searchQuery.length === 0"
          name="i-lucide:search"
          class="cursor-pointer"
          color="neutral"
          variant="link"
          @click="searchQuery = ''"
        />
        <UButton
          v-else
          variant="link"
          color="neutral"
          class="p-0 cursor-pointer"
          @click="clearSearch"
        >
          <UIcon name="i-lucide:x" color="neutral" size="xl" class="size-5" />
        </UButton>
      </template>

      <template #trailing>
        <UIcon name="i-lucide:corner-down-left" />
      </template>
    </UInput>
    <UButton
      icon="i-lucide:clapperboard"
      :label="$t('navbar.search.movies')"
      color="secondary"
      :variant="activeSearch === 'movie' ? 'solid' : 'outline'"
      size="xl"
      class="transition-all duration-300 ease-out"
      @click="handleChangeActiveSearch('movie')"
    >
      <template #trailing>
        <UKbd value="m" class="hidden sm:inline-flex" />
      </template>
    </UButton>
    <UButton
      icon="i-lucide:tv-minimal-play"
      :label="$t('navbar.search.tv')"
      color="secondary"
      :variant="activeSearch === 'tv' ? 'solid' : 'outline'"
      size="xl"
      class="transition-all duration-300 ease-out"
      @click="handleChangeActiveSearch('tv')"
    >
      <template #trailing>
        <UKbd value="t" class="hidden sm:inline-flex" />
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
  input.value?.inputRef?.blur()
}, 750)

defineShortcuts({
  m: () => {
    handleChangeActiveSearch('movie')
    input.value?.inputRef?.focus()
  },
  t: () => {
    handleChangeActiveSearch('tv')
    input.value?.inputRef?.focus()
  },
  escape: {
    handler: () => {
      handleEscape()
      input.value?.inputRef?.blur()
    },
    usingInput: true
  },
  enter: {
    handler: () => {
      handleSearch()
      input.value?.inputRef?.blur()
    },
    usingInput: true
  }
})

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  navigateSafely(`/search?query=${searchQuery.value}&type=${activeSearch.value}`)
}

const clearSearch = () => {
  searchQuery.value = ''
  input.value?.inputRef?.focus()
  navigateSafely('/search')
}

const handleChangeActiveSearch = (type: 'movie' | 'tv') => {
  activeSearch.value = type

  if (searchQuery.value.trim()) {
    navigateSafely(`/search?query=${searchQuery.value}&type=${type}`)
  }
}

const handleEscape = () => {
  input.value?.inputRef?.blur()
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
