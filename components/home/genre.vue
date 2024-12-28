<template>
  <badge-list
    :badge-list="genres"
    :title="$t('genre.title')"
    @update:selected-badges="selectedGenres = $event"
  />
</template>

<script lang="ts" setup>
const i18n: any = useNuxtApp().$i18n

const emit = defineEmits(['update:selectedGenres'])

const selectedGenres = ref<BadgeList[]>([])
const genres = ref<BadgeList[]>([])

watch(selectedGenres, (value) => {
  emit('update:selectedGenres', value)
})

onMounted(async () => {
  const { locale } = useI18n()
  const colors = Object.values(Colors)

  const res = await $fetch(`/api/themoviedb/genre/movie/list?language=${locale.value}`)

  genres.value = res?.genres.map((genre: any, index: number) => ({
    id: genre.id,
    name: genre.name,
    color: colors[index % colors.length],
    selected: false
  }))
})
</script>
