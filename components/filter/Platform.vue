<template>
  <NuxtLayout name="filter" :title="$t('platforms.title')">
    <template #content>
      <div class="w-full flex justify-center">
        <LazyFieldMultiSelect
          ref="multiSelectRef"
          v-model="platforms"
          name="platforms"
          class="w-full"
          @update:selected-options="emit('update:selectedPlatforms', $event)"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { locale } = useI18n()

const props = defineProps({
  type: {
    type: String as PropType<'movie' | 'tv'>,
    required: true
  }
})

const emit = defineEmits(['update:selectedPlatforms'])

const platforms = ref<Option[]>([])
const multiSelectRef = ref()

onMounted(async () => {
  await fetchPlatforms()
})

const fetchPlatforms = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/watch/providers/${props.type}`)
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  platforms.value = data.results.map((platform: any) => ({
    id: platform.provider_id,
    label: platform.provider_name
  }))
}

const reset = () => {
  multiSelectRef.value.unselectAll()
}

watch(
  () => props.type,
  (newType, prevType) => {
    if (newType !== prevType) {
      fetchPlatforms()
    }
  }
)

defineExpose({
  reset
})
</script>
