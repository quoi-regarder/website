<template>
  <NuxtLayout name="filter" :title="$t('company.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
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

const emit = defineEmits({
  'update:selectedCompanies': {
    type: Function as PropType<(companies: Option[]) => void>,
    required: true
  }
})
</script>
