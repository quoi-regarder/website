<template>
  <NuxtLayout name="filter" :title="title" has-buttons>
    <template #buttons>
      <UButton :label="$t('dateRange.buttons.reset')" @click="handleReset" />
    </template>

    <template #content>
      <div class="w-full h-full grid grid-cols-3 gap-4 items-center justify-center">
        <p class="text-sm col-span-1 text-right">
          {{ $t('dateRange.from') }}
        </p>
        <UPopover class="col-span-2">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            class="w-fit"
            :label="fromDate ? formatLocalDate(fromDate as CalendarDate) : ''"
          >
            <template #icon>
              <i class="text-xl" />
            </template>
          </UButton>

          <template #content>
            <UCalendar
              v-model="fromDate"
              is-required
              fixed-weeks
              @update:model-value="emit('update:from-date', fromDate)"
            />
          </template>
        </UPopover>

        <p class="text-sm col-span-1 text-right">
          {{ $t('dateRange.to') }}
        </p>

        <UPopover class="col-span-2">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            class="w-fit"
            :label="toDate ? formatLocalDate(toDate as CalendarDate) : ''"
          >
            <template #icon>
              <i class="text-xl" />
            </template>
          </UButton>

          <template #content>
            <UCalendar
              v-model="toDate"
              is-required
              fixed-weeks
              @update:model-value="emit('update:to-date', toDate)"
            />
          </template>
        </UPopover>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { CalendarDate } from '@internationalized/date'

const fromDate = ref<CalendarDate | null>()
const toDate = ref<CalendarDate | null>()

defineProps({
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:from-date', 'update:to-date'])

const handleReset = () => {
  fromDate.value = null
  toDate.value = null

  emit('update:from-date', null)
  emit('update:to-date', null)
}

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

watch([fromDate, toDate], handleReverseDates, { immediate: true })

const reset = () => {
  handleReset()
}

defineExpose({
  reset
})
</script>
