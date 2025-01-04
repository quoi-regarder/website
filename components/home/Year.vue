<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col desktop:flex-row items-start gap-x-4 p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <div class="flex flex-col w-full desktop:w-1/3">
        <h3 class="font-bold desktop:text-right text-wrap">
          {{ $t('year.title') }}
        </h3>
        <p class="text-sm desktop:text-justify text-wrap text-gray-500 dark:text-gray-200">
          {{ $t('year.hint') }}
        </p>
      </div>
      <div class="w-full flex items-center">
        <LazyFieldMultiSelect
          :options="years"
          name="year"
          class="w-full"
          @update:model-value="emit('update:selectedYears', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const years = ref<Option[]>([])

const emit = defineEmits({
  'update:selectedYears': {
    type: Function as PropType<(years: Option[]) => void>,
    required: true
  },
  'update:years': {
    type: Array as PropType<Option[]>,
    required: false
  }
})

onMounted(async () => {
  await fetchYears()
})

const fetchYears = async () => {
  years.value = Array.from({ length: new Date().getFullYear() - 1894 }, (_, i) => ({
    id: i,
    name: (new Date().getFullYear() - i).toString()
  }))

  emit('update:years', years.value)
}
</script>
