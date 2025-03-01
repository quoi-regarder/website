<template>
  <div class="w-full flex flex-col overflow-hidden transition-all duration-500 ease-out relative">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
      <!-- Genres and platforms -->
      <div class="flex flex-col gap-4 md:col-span-7 lg:col-span-8 order-1">
        <HomeFilterGenre v-model:genres="genres" v-model="filters.selectedGenres" />
        <HomeFilterPlatform v-model="filters.selectedPlatforms" />
      </div>

      <!-- Mark -->
      <div class="flex md:col-span-5 lg:col-span-4 items-center justify-center order-2">
        <HomeFilterMark />
      </div>
    </div>

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
  </div>
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
