<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-2xl dark:bg-gray-700">
      <div class="w-1/5">
        <h3 class="font-bold text-right">
          {{ $t('year.title') }}
        </h3>
      </div>
      <div class="w-full flex items-center gap-4">
        <field-multi-select
          :hint="$t('year.hint')"
          :options="years"
          :placeholder="$t('year.placeholder')"
          name="year"
          @update:model-value="selectedYears = $event"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:selected-years'])

const selectedYears = ref<Option[]>([])

watch(selectedYears, (value) => {
  emit('update:selected-years', value)
})

const years = ref<Option[]>(
  Array.from({ length: new Date().getFullYear() - 1894 }, (_, i) => ({
    id: i,
    name: (new Date().getFullYear() - i).toString()
  }))
)
</script>
