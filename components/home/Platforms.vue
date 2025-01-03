<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-2xl dark:bg-gray-700">
      <div class="w-1/5">
        <h3 class="font-bold text-right">
          {{ $t('platforms.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center gap-4">
        <LazyFieldMultiSelect
          :options="platforms"
          :placeholder="$t('platforms.placeholder')"
          name="platforms"
          @update:model-value="emit('update:selectedPlatforms', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n()

const platforms = ref([])

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
