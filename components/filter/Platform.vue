<template>
  <NuxtLayout name="filter" :title="$t('platforms.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          name="platforms"
          :options="platforms"
          class="w-full"
          @update:model-value="emit('update:selectedPlatforms', $event)"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { locale } = useI18n()

const platforms = ref<Option[]>([])

const emit = defineEmits({
  'update:selectedPlatforms': {
    type: Function as PropType<(platforms: Option[]) => void>,
    required: true
  },
  'update:platforms': {
    type: Array as PropType<Option[]>,
    required: false
  }
})

onMounted(async () => {
  await fetchPlatforms()
})

const fetchPlatforms = async () => {
  const manager = new QueryParamsManager('/api/themoviedb/watch/providers/movie')
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  platforms.value = data.results.map((platform: any) => ({
    id: platform.provider_id,
    name: platform.provider_name
  }))

  emit('update:platforms', platforms.value)
}
</script>
