<template>
  <NuxtLayout name="filter" :title="$t('person.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          ref="multiSelectRef"
          v-model:selected-options="filters.selectedPersons"
          :api-to-fecth="'/api/themoviedb/search/person'"
          name="persons"
          class="w-full"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { filters } = useFilters()
</script>
