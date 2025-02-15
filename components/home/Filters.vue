<template>
  <div
    class="w-full flex flex-col overflow-hidden transition-all duration-500 ease-out relative z-10"
  >
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

    <UButton class="my-4 self-center" size="xl" variant="soft" @click="toggleMoreFilters">
      <div class="flex flex-col items-center justify-center">
        <span>{{ $t('home.form.buttons.moreFilters') }}</span>
        <UIcon
          :class="{ 'rotate-180': moreFilters }"
          class="text-[var(--ui-color-primary-400)] size-6 transition-all duration-300"
          name="i-heroicons-chevron-down"
        />
      </div>
    </UButton>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:genres', 'update:moreFilters'])

const { filters } = useFilters()

const moreFilters = ref(false)

const genres = defineModel<Option[]>('genres', {
  required: true,
  default: () => []
})

const toggleMoreFilters = async () => {
  moreFilters.value = !moreFilters.value
  emit('update:moreFilters', moreFilters.value)

  await nextTick()

  const scrollTarget = moreFilters.value ? document.getElementById('filters')?.offsetTop : 0
  window.scrollTo({ top: scrollTarget, behavior: 'smooth' })

  if (scrollTarget) {
    const isMobile = window.innerWidth <= 768

    window.scrollTo({
      top: isMobile ? scrollTarget - 70 : scrollTarget - 250,
      behavior: 'smooth'
    })
  }
}
</script>
