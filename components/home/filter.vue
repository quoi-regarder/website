<template>
  <badge-list
    :badge-list="filter"
    :title="$t('filter.title')"
    :unique-selection="true"
    @update:selected-badges="selectedFilter = $event"
  />
</template>

<script lang="ts" setup>
const i18n: any = useNuxtApp().$i18n

const emit = defineEmits(['update:selectedFilter'])

const selectedFilter = ref<Badge[]>([])

watch(selectedFilter, (value) => {
  emit('update:selectedFilter', value)
})

const filter = ref<Badge[]>([
  { id: i18n.t('filter.labels.popularity'), name: 'popular', color: 'red', selected: false },
  { id: i18n.t('filter.labels.topRated'), name: 'topRated', color: 'green', selected: false },
  { id: i18n.t('filter.labels.upcoming'), name: 'upcoming', color: 'orange', selected: false },
  {
    id: i18n.t('filter.labels.nowPlaying'),
    name: 'nowPlaying',
    color: 'amber',
    selected: false
  },
  { id: i18n.t('filter.labels.latest'), name: 'latest', color: 'yellow', selected: false },
  { id: i18n.t('filter.labels.oldest'), name: 'oldest', color: 'lime', selected: false }
])
</script>
