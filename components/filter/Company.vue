<template>
  <NuxtLayout name="filter" :title="$t('company.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          ref="multiSelectRef"
          name="companies"
          :api-to-fecth="'/api/themoviedb/search/company'"
          :options="companies"
          class="w-full"
          @update:model-value="emit('update:selectedCompanies', $event)"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const companies = ref<Option[]>([])
const multiSelectRef = ref()

const emit = defineEmits({
  'update:selectedCompanies': {
    type: Function as PropType<(companies: Option[]) => void>,
    required: true
  }
})

const reset = () => {
  companies.value.forEach((company) => {
    company.selected = false
  })
  multiSelectRef.value.reset()
}

defineExpose({
  reset
})
</script>
