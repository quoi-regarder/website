<template>
  <LazyBadgeList
    :badges="genres"
    :title="$t('genre.title')"
    :hint="$t('genre.hint')"
    @update:selected-badges="emit('update:selectedGenres', $event)"
  />
</template>

<script lang="ts" setup>
const { locale } = useI18n()
const colors = Object.values(Colors)

const genres = ref([])

const emit = defineEmits({
  'update:selectedGenres': {
    type: Function as PropType<(genres: Badge[]) => void>,
    required: true
  },
  'update:genres': {
    type: Array as PropType<Badge[]>,
    required: false
  }
})

onMounted(async () => {
  await fetchGenres()
})

const fetchGenres = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/genre/movie/list')
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  genres.value = data.genres.map((genre: any, index: number) => ({
    id: genre.id,
    name: genre.name,
    color: colors[index % colors.length],
    selected: false
  }))

  emit('update:genres', genres.value)
}
</script>
