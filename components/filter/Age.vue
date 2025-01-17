<template>
  <BadgeList
    ref="badgeList"
    v-model="ages"
    :title="$t('age.title')"
    @update:selected-badges="emit('update:selectedAges', $event)"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n()

const emit = defineEmits(['update:selectedAges'])

const badgeList = ref()

const ages = ref<Option[]>([
  { id: 10, label: t('age.labels.ten'), selected: false },
  { id: 12, label: t('age.labels.twelve'), selected: false },
  { id: 16, label: t('age.labels.sixteen'), selected: false },
  { id: 18, label: t('age.labels.eighteen'), selected: false }
])

const reset = () => {
  badgeList.value.unselectAll()
}

defineExpose({
  reset
})
</script>
