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
const { locale } = useI18n()

const { selectedType, filters } = useFilters()

const platforms = ref<Option[]>([])

onMounted(async () => {
  await fetchPlatforms()
})

const fetchPlatforms = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/watch/providers/${selectedType.value}`)
  manager.add('language', locale.value)

  const data: any = await $fetch(manager.toString())

  platforms.value = data.results.map((platform: any) => ({
    id: platform.provider_id,
    label: platform.provider_name
  }))
}

watch(
  () => selectedType.value,
  (newType, oldType) => {
    if (newType !== oldType) {
      fetchPlatforms()
    }
  }
)
</script>
