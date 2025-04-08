<template>
  <NuxtLayout name="filter" :title="$t('platforms.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          v-model="platforms"
          v-model:selected-options="filters.selectedPlatforms"
          name="platforms"
          class="w-full"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { selectedType, filters } = useFilters()
const { platforms, refresh } = useTmdbPlatforms(computed(() => selectedType.value))

onMounted(() => {
  refresh()
})

watch(selectedType, () => {
  refresh()
})
</script>
