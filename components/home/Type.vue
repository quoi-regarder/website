<template>
  <LazyBadgeList
    :badges="types"
    :title="$t('type.title')"
    @update:selected-badges="emit('update:selectedTypes', $event)"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n()

const types = ref<Badge[]>([])

const emit = defineEmits({
  'update:selectedTypes': {
    type: Function as PropType<(types: Badge[]) => void>,
    required: true
  },
  'update:types': {
    type: Array as PropType<Badge[]>,
    required: false
  }
})

onMounted(async () => {
  await fetchTypes()
})

const fetchTypes = async () => {
  types.value = [
    { id: 1, name: t('type.labels.anime'), color: 'orange', selected: false },
    { id: 2, name: t('type.labels.documentary'), color: 'fuchsia', selected: false },
    { id: 3, name: t('type.labels.movie'), color: 'purple', selected: false },
    { id: 4, name: t('type.labels.other'), color: 'cyan', selected: false },
    { id: 5, name: t('type.labels.series'), color: 'yellow', selected: false },
    { id: 6, name: t('type.labels.shortFilm'), color: 'emerald', selected: false }
  ]

  emit('update:types', types.value)
}
</script>
