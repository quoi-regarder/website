<template>
  <div class="w-full flex flex-col overflow-hidden transition-all duration-500 ease-out relative">
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-4 p-4">
      <HomeFilterGenre
        v-model:genres="genres"
        v-model="filters.selectedGenres"
        class="xl:col-span-3 xl:row-span-2 h-full"
      />
      <HomeFilterPlatform
        v-model="filters.selectedPlatforms"
        class="xl:col-span-2 xl:row-span-1 h-full"
      />

      <HomeFilterVotes v-model="filters.selectedVotes" class="xl:col-span-2 xl:row-span-1 h-full" />
    </div>

    <UButton
      size="lg"
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
const emit = defineEmits(['update:moreFilters'])

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
