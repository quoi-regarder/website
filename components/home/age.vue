<template>
  <badge-list
    :badge-list="ages"
    :title="$t('age.title')"
    @update:selected-badges="selectedAges = $event"
  />
</template>

<script lang="ts" setup>
const i18n: any = useNuxtApp().$i18n

const emit = defineEmits(['update:selectedAges'])

const selectedAges = ref<Badge[]>([])

watch(selectedAges, (value) => {
  emit('update:selectedAges', value)
})

const ages = ref<Badge[]>([
  { id: 1, name: i18n.t('age.labels.all'), color: 'yellow', selected: false },
  { id: 2, name: i18n.t('age.labels.ten'), color: 'lime', selected: false },
  { id: 3, name: i18n.t('age.labels.twelve'), color: 'emerald', selected: false },
  { id: 4, name: i18n.t('age.labels.fourteen'), color: 'teal', selected: false },
  { id: 5, name: i18n.t('age.labels.sixteen'), color: 'cyan', selected: false },
  { id: 6, name: i18n.t('age.labels.eighteen'), color: 'sky', selected: false }
])
</script>
