<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col laptop-md:flex-row items-start gap-x-4 p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <div class="flex flex-col w-full laptop-md:w-1/3">
        <h3 class="font-bold laptop-md:text-right text-wrap">
          {{ $t('platforms.title') }}
        </h3>
      </div>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          :options="platforms"
          name="platforms"
          class="w-full"
          @update:model-value="emit('update:selectedPlatforms', $event)"
        />
      </div>
    </div>
  </div>
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
