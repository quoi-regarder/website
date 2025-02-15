<template>
  <NuxtLayout name="filter" :title="$t('company.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          ref="multiSelectRef"
          v-model:selected-options="filters.selectedCompanies"
          name="companies"
          :api-to-fecth="'/api/themoviedb/search/company'"
          class="w-full"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { filters } = useFilters()
</script>
