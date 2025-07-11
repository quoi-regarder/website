<template>
  <NuxtLayout name="filter" :title="$t('genre.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          v-model="genres"
          v-model:selected-options="filters.selectedGenres"
          name="genres"
          class="w-full"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { selectedType, filters } = useFilters()
const { genres: genresList, refresh } = useTmdbGenres(computed(() => selectedType.value))

const genres = defineModel<Option[]>('genres', {
  required: true,
  default: () => []
})

watch(
  genresList,
  (newGenres) => {
    if (newGenres) {
      genres.value = newGenres
    }
  },
  { immediate: true }
)

onMounted(() => {
  refresh()
})

watch(selectedType, () => {
  refresh()
})
</script>
