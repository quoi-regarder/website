<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div
      class="flex flex-col laptop-md:flex-row items-start gap-x-4 p-2 w-full bg-gray-100 rounded-2xl dark:bg-gray-700"
    >
      <div class="flex flex-row laptop-md:flex-col w-full justify-between laptop-md:w-1/3">
        <h3 class="font-bold laptop-md:text-right text-wrap">
          {{ $t('year.title') }}
        </h3>

        <UButton
          :label="$t('year.buttons.reset')"
          class="mt-0 laptop-md:mt-2 self-center laptop-md:self-end"
          @click="handleReset"
        />
      </div>
      <div
        class="w-full flex items-center justify-center gap-2 mt-4 flex-wrap laptop-md:mt-0 laptop-md:grid laptop-md:grid-cols-3 laptop-md:gap-4"
      >
        <p
          class="text-sm text-gray-500 dark:text-gray-400 laptop-md:col-span-1 laptop-md:text-right"
        >
          {{ $t('year.from') }}
        </p>
        <UPopover class="laptop-md:col-span-2">
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

        <p
          class="text-sm text-gray-500 dark:text-gray-400 laptop-md:col-span-1 laptop-md:text-right"
        >
          {{ $t('year.to') }}
        </p>

        <UPopover class="laptop-md:col-span-2">
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
    </div>
  </div>
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
