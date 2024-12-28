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

const selectedFilter = ref<BadgeList[]>([])

watch(selectedFilter, (value) => {
  emit('update:selectedFilter', value)
})

const filter = ref<BadgeList[]>([
  { label: i18n.t('filter.labels.popularity'), value: 'popular', color: 'red', selected: false },
  { label: i18n.t('filter.labels.topRated'), value: 'topRated', color: 'green', selected: false },
  { label: i18n.t('filter.labels.upcoming'), value: 'upcoming', color: 'orange', selected: false },
  {
    label: i18n.t('filter.labels.nowPlaying'),
    value: 'nowPlaying',
    color: 'amber',
    selected: false
  },
  { label: i18n.t('filter.labels.latest'), value: 'latest', color: 'yellow', selected: false },
  { label: i18n.t('filter.labels.oldest'), value: 'oldest', color: 'lime', selected: false }
])
</script>
