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
const { locale } = useI18n()

const { selectedType, filters } = useFilters()

const genres = defineModel<Option[]>('genres', {
  required: true,
  default: () => []
})

onMounted(async () => {
  await fetchGenres()
})

const fetchGenres = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/genre/${selectedType.value}/list`)
  manager.add('language', locale.value)
  const data: any = await $fetch(manager.toString())

  genres.value = data.genres.map((genre: any) => ({
    id: genre.id,
    label: genre.name
  }))
}

watch(
  () => selectedType.value,
  (newType, oldType) => {
    if (newType !== oldType) {
      fetchGenres()
    }
  }
)
</script>
