<template>
  <NuxtLayout name="filter" :title="title" has-buttons>
    <template #buttons>
      <UButton :label="$t('dateRange.buttons.reset')" @click="reset" />
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
            <UCalendar v-model="fromDate as CalendarDate" is-required fixed-weeks />
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
            <UCalendar v-model="toDate as CalendarDate" is-required fixed-weeks />
          </template>
        </UPopover>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { CalendarDate } from '@internationalized/date'

defineProps({
  title: {
    type: String,
    required: true
  }
})

const fromDate = defineModel<CalendarDate | null>('fromDate', {
  required: true,
  default: null
})

const toDate = defineModel<CalendarDate | null>('toDate', {
  required: true,
  default: null
})

const reset = () => {
  fromDate.value = null
  toDate.value = null
}

const handleReverseDates = () => {
  if (!fromDate.value || !toDate.value) return

  if (fromDate.value > toDate.value) {
    const temp = fromDate.value
    fromDate.value = toDate.value
    toDate.value = temp
  }
}

watch([fromDate, toDate], handleReverseDates, { immediate: true })
</script>
