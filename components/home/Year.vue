<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-2xl dark:bg-gray-700">
      <div class="w-1/5">
        <h3 class="font-bold text-right">
          {{ $t('year.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center gap-4">
        <LazyFieldMultiSelect
          :hint="$t('year.hint')"
          :options="years"
          :placeholder="$t('year.placeholder')"
          name="year"
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
