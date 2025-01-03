<template>
  <LazyBadgeList
    :badges="filters"
    :title="$t('filter.title')"
    :unique-selection="true"
    @update:selected-badges="emit('update:selectedFilter', $event)"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n()

const filters = ref<Badge[]>([])

const emit = defineEmits({
  'update:selectedFilter': {
    type: Function as PropType<(filter: Badge[]) => void>,
    required: true
  },
  'update:filter': {
    type: Array as PropType<Badge[]>,
    required: false
  }
})

onMounted(async () => {
  await fetchFilters()
})

const fetchFilters = async () => {
  filters.value = [
    { id: 1, name: t('filter.labels.popularity'), color: 'red', selected: false },
    { id: 2, name: t('filter.labels.topRated'), color: 'green', selected: false },
    { id: 3, name: t('filter.labels.upcoming'), color: 'orange', selected: false },
    {
      id: 4,
      name: t('filter.labels.nowPlaying'),
      color: 'amber',
      selected: false
    },
    { id: 5, name: t('filter.labels.latest'), color: 'yellow', selected: false },
    { id: 6, name: t('filter.labels.oldest'), color: 'lime', selected: false }
  ]

  emit('update:filter', filters.value)
}
</script>
