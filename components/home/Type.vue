<template>
  <badge-list
    :badge-list="types"
    :title="$t('type.title')"
    @update:selected-badges="selectedTypes = $event"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n()
const emit = defineEmits(['update:selectedTypes'])

const selectedTypes = ref<Badge[]>([])

watch(selectedTypes, (value) => {
  emit('update:selectedTypes', value)
})

const types = ref<Badge[]>([
  { id: 1, name: t('type.labels.anime'), color: 'orange', selected: false },
  { id: 2, name: t('type.labels.documentary'), color: 'fuchsia', selected: false },
  { id: 3, name: t('type.labels.movie'), color: 'purple', selected: false },
  { id: 4, name: t('type.labels.other'), color: 'cyan', selected: false },
  { id: 5, name: t('type.labels.series'), color: 'yellow', selected: false },
  { id: 6, name: t('type.labels.shortFilm'), color: 'emerald', selected: false }
])
</script>
