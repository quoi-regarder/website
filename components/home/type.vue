<template>
  <badge-list
    :badge-list="types"
    :title="$t('type.title')"
    @update:selected-badges="selectedTypes = $event"
  />
</template>

<script lang="ts" setup>
const i18n: any = useNuxtApp().$i18n

const emit = defineEmits(['update:selectedTypes'])

const selectedTypes = ref<Badge[]>([])

watch(selectedTypes, (value) => {
  emit('update:selectedTypes', value)
})

const types = ref<Badge[]>([
  { id: 1, name: i18n.t('type.labels.anime'), color: 'orange', selected: false },
  { id: 2, name: i18n.t('type.labels.documentary'), color: 'fuchsia', selected: false },
  { id: 3, name: i18n.t('type.labels.movie'), color: 'purple', selected: false },
  { id: 4, name: i18n.t('type.labels.other'), color: 'cyan', selected: false },
  { id: 5, name: i18n.t('type.labels.series'), color: 'yellow', selected: false },
  { id: 6, name: i18n.t('type.labels.shortFilm'), color: 'emerald', selected: false }
])
</script>
