<template>
  <LazyBadgeList
    ref="badgeList"
    v-model="genres"
    :title="$t('genre.title')"
    :description="$t('genre.description')"
    @update:selected-badges="emit('update:selectedGenres', $event)"
  />
</template>

<script lang="ts" setup>
const { locale } = useI18n()

const props = defineProps({
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  }
})

const genres = defineModel({
  required: true,
  default: [],
  type: Array as PropType<Option[]>
})

const emit = defineEmits(['update:genres', 'update:selectedGenres'])

const badgeList = ref()

onMounted(async () => {
  await fetchGenres()
})

const fetchGenres = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/genre/${props.type}/list`)
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  genres.value = data.genres.map((genre: any) => ({
    id: genre.id,
    label: genre.name,
    selected: false
  }))

  emit('update:genres', genres.value)
}

const reset = () => {
  badgeList.value.unselectAll()
}
watch(
  () => props.type,
  (newType, oldType) => {
    if (newType !== oldType) {
      fetchGenres()
    }
  }
)

defineExpose({
  reset
})
</script>
