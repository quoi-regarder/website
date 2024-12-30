<template>
  <badge-list
    :badge-list="filter"
    :title="$t('filter.title')"
    :unique-selection="true"
    @update:selected-badges="selectedFilter = $event"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n()
const emit = defineEmits(['update:selectedFilter'])

const selectedFilter = ref<Badge[]>([])

watch(selectedFilter, (value) => {
  emit('update:selectedFilter', value)
})

const filter = ref<Badge[]>([
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
])
</script>
