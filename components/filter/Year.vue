<template>
  <NuxtLayout name="filter" :title="$t('year.title')" has-buttons>
    <template #buttons>
      <UButton :label="$t('year.buttons.reset')" @click="handleReset" />
    </template>

    <template #content>
      <div class="w-full h-full grid grid-cols-3 gap-4 items-center justify-center">
        <p class="text-sm text-gray-500 dark:text-gray-400 col-span-1 text-right">
          {{ $t('year.from') }}
        </p>
        <UPopover class="col-span-2">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="fromDate ? formatLocalDate(fromDate) : ''"
          >
            <template #icon>
              <i class="text-xl" />
            </template>
          </UButton>

          <template #panel="{ close }">
            <FieldDatePicker v-model="fromDate" is-required @close="close" />
          </template>
        </UPopover>

        <p class="text-sm text-gray-500 dark:text-gray-400 col-span-1 text-right">
          {{ $t('year.to') }}
        </p>

        <UPopover class="col-span-2">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="toDate ? formatLocalDate(toDate) : ''"
          >
            <template #icon>
              <i class="text-xl" />
            </template>
          </UButton>

          <template #panel="{ close }">
            <FieldDatePicker v-model="toDate" is-required @close="close" />
          </template>
        </UPopover>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const fromDate = ref<Date | null>(null)
const toDate = ref<Date | null>(null)

const emit = defineEmits({
  'update:from-date': {
    type: Function as PropType<(date: Date | null) => void>,
    required: true
  },
  'update:to-date': {
    type: Function as PropType<(date: Date | null) => void>,
    required: true
  }
})

const handleReset = () => {
  fromDate.value = null
  toDate.value = null
}

watch(fromDate, (value) => {
  handleReverseDates()
  emit('update:from-date', value)
})

watch(toDate, (value) => {
  handleReverseDates()
  emit('update:to-date', value)
})

const handleReverseDates = () => {
  if (!fromDate.value || !toDate.value) return

  if (fromDate.value > toDate.value) {
    const temp = fromDate.value
    fromDate.value = toDate.value
    toDate.value = temp
  }

  emit('update:from-date', fromDate.value)
  emit('update:to-date', toDate.value)
}
</script>
