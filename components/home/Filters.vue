<template>
  <UContainer class="w-full flex flex-col gap-4 transition-all duration-500 ease-out relative">
    <HomeFilterGenre v-model:genres="genres" v-model="filters.selectedGenres" />
    <HomeFilterPlatform v-model="filters.selectedPlatforms" />
    <HomeFilterMark />

    <UButton
      size="md"
      class="self-center"
      color="secondary"
      :label="
        moreFilters ? $t('home.form.buttons.lessFilters') : $t('home.form.buttons.moreFilters')
      "
      :trailing-icon="moreFilters ? 'i-lucide:chevron-up' : 'i-lucide:chevron-down'"
      @click="toggleMoreFilters"
    >
    </UButton>
  </UContainer>
</template>

<script lang="ts" setup>
const { filters } = useFilters()

const genres = defineModel<Option[]>('genres', {
  required: true,
  default: () => []
})

const moreFilters = defineModel<boolean>('moreFilters', {
  required: true,
  default: false
})

const toggleMoreFilters = async () => {
  moreFilters.value = !moreFilters.value

  await nextTick()

  const scrollTarget = moreFilters.value ? document.getElementById('filters')?.offsetTop : 0
  window.scrollTo({ top: scrollTarget, behavior: 'smooth' })

  if (scrollTarget) {
    const isMobile = window.innerWidth <= 768
    const offset = isMobile ? 70 : 250

    window.scrollTo({
      top: scrollTarget - offset,
      behavior: 'smooth'
    })
  }
}
</script>
