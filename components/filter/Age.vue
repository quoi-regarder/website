<template>
  <LazyBadgeList
    :badges="ages"
    :title="$t('age.title')"
    :hint="$t('age.hint')"
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
    { id: 10, name: t('age.labels.ten'), color: 'lime', selected: false },
    { id: 12, name: t('age.labels.twelve'), color: 'emerald', selected: false },
    { id: 16, name: t('age.labels.sixteen'), color: 'cyan', selected: false },
    { id: 18, name: t('age.labels.eighteen'), color: 'sky', selected: false }
  ]

  emit('update:ages', ages.value)
}
</script>
