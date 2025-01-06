<template>
  <LazyFieldMultiSelect
    name="search"
    :label="$t('home.form.fields.search')"
    :description="$t('home.form.descriptions.search')"
    :api-to-fecth="'/api/themoviedb/search/keyword'"
    :options="keywords"
    @update:model-value="emit('update:selectedKeywords', $event)"
  />
</template>

<script lang="ts" setup>
const keywords = ref<Option[]>([])

const emit = defineEmits({
  'update:selectedKeywords': {
    type: Function as PropType<(keywords: Option[]) => void>,
    required: true
  }
})

const reset = () => {
  keywords.value.forEach((keyword) => {
    keyword.selected = false
  })

  emit('update:selectedKeywords', [])
}

defineExpose({
  reset
})
</script>
