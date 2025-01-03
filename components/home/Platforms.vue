<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-2xl dark:bg-gray-700">
      <div class="w-1/5">
        <h3 class="font-bold text-right">
          {{ $t('platforms.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center gap-4">
        <field-multi-select
          :options="platforms"
          :placeholder="$t('platforms.placeholder')"
          name="platforms"
          @update:model-value="selectedPlatforms = $event"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:selectedPlatforms'])

const selectedPlatforms = ref<Option[]>([])
const { locale } = useI18n()

const manager = new QueryParamsManager('/api/themoviedb/watch/providers/movie')
manager.add('language', locale.value)

const { data, error } = useFetch(manager.toString())

const platforms = computed(
  () =>
    data.value?.results?.map((platform: any) => ({
      id: platform.provider_id,
      name: platform.provider_name
    })) || []
)

watch(selectedPlatforms, (value) => {
  emit('update:selectedPlatforms', value)
})
</script>
