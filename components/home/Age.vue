<template>
  <LazyBadgeList
    :badges="ages"
    :title="$t('age.title')"
    @update:selected-badges="emit('update:selectedAges', $event)"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n()

const ages = ref<Badge[]>([])

const emit = defineEmits({
  'update:selectedAges': {
    type: Function as PropType<(ages: Badge[]) => void>,
    required: true
  },
  'update:ages': {
    type: Array as PropType<Badge[]>,
    required: false
  }
})

onMounted(async () => {
  await fetchAges()
})

const fetchAges = async () => {
  ages.value = [
    { id: 1, name: t('age.labels.all'), color: 'yellow', selected: false },
    { id: 2, name: t('age.labels.ten'), color: 'lime', selected: false },
    { id: 3, name: t('age.labels.twelve'), color: 'emerald', selected: false },
    { id: 4, name: t('age.labels.fourteen'), color: 'teal', selected: false },
    { id: 5, name: t('age.labels.sixteen'), color: 'cyan', selected: false },
    { id: 6, name: t('age.labels.eighteen'), color: 'sky', selected: false }
  ]

  emit('update:ages', ages.value)
}
</script>
