<template>
  <badge-list
    :badge-list="genres"
    :title="$t('genre.title')"
    @update:selected-badges="selectedGenres = $event"
  />
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:selectedGenres', 'update:genres'])

const selectedGenres = ref<Badge[]>([])
const { locale } = useI18n()
const colors = Object.values(Colors)

const manager = new QueryParamsManager('/api/themoviedb/genre/movie/list')
manager.add('language', locale.value)

const { data, error } = useFetch(manager.toString())

const genres = computed(
  () =>
    data.value?.genres?.map((genre: any, index: number) => ({
      id: genre.id,
      name: genre.name,
      color: colors[index % colors.length],
      selected: false
    })) || []
)

watch(selectedGenres, (value) => {
  emit('update:selectedGenres', value)
})
</script>
