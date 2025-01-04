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
    {
      id: 'original_title.asc',
      name: t('filter.labels.original_title.asc'),
      color: 'violet',
      selected: false
    },
    {
      id: 'original_title.desc',
      name: t('filter.labels.original_title.desc'),
      color: 'violet',
      selected: false
    },
    // { id: 'popularity.asc', name: t('filter.labels.popularity.asc'), color: 'rose', selected: false },
    // { id: 'popularity.desc', name: t('filter.labels.popularity.desc'), color: 'rose', selected: false },
    { id: 'revenue.asc', name: t('filter.labels.revenue.asc'), color: 'emerald', selected: false },
    {
      id: 'revenue.desc',
      name: t('filter.labels.revenue.desc'),
      color: 'emerald',
      selected: false
    },
    {
      id: 'primary_release_date.asc',
      name: t('filter.labels.primary_release_date.asc'),
      color: 'sky',
      selected: false
    },
    {
      id: 'primary_release_date.desc',
      name: t('filter.labels.primary_release_date.desc'),
      color: 'sky',
      selected: false
    },
    { id: 'title.asc', name: t('filter.labels.title.asc'), color: 'fuchsia', selected: false },
    { id: 'title.desc', name: t('filter.labels.title.desc'), color: 'fuchsia', selected: false },
    {
      id: 'vote_average.asc',
      name: t('filter.labels.vote_average.asc'),
      color: 'amber',
      selected: false
    },
    {
      id: 'vote_average.desc',
      name: t('filter.labels.vote_average.desc'),
      color: 'amber',
      selected: false
    },
    {
      id: 'vote_count.asc',
      name: t('filter.labels.vote_count.asc'),
      color: 'teal',
      selected: false
    },
    {
      id: 'vote_count.desc',
      name: t('filter.labels.vote_count.desc'),
      color: 'teal',
      selected: false
    }
  ]

  emit('update:filter', filters.value)
}
</script>
