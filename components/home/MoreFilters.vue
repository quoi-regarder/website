<template>
  <div
    v-if="moreFilters"
    id="filters"
    class="grid grid-cols-1 items-center xl:grid-cols-6 gap-4 p-4"
  >
    <HomeFilterBy class="xl:col-span-4 xl:row-span-1 order-1 xl:order-none h-full" />

    <HomeFilterPerson
      v-if="isMovieTypeActive"
      class="xl:col-span-2 xl:row-span-1 order-2 xl:order-none h-full"
    />

    <HomeFilterMonetization class="xl:col-span-2 xl:row-span-1 order-4 xl:order-none h-full" />

    <HomeFilterDateRange
      v-if="isTvTypeActive"
      v-model:to-date="filters.airToDate as CalendarDate"
      v-model:from-date="filters.airFromDate as CalendarDate"
      class="xl:col-span-2 xl:row-span-1 order-5 xl:order-none h-full"
      :title="$t('dateRange.air_date')"
    />

    <HomeFilterDateRange
      v-model:to-date="filters.toDate as CalendarDate"
      v-model:from-date="filters.fromDate as CalendarDate"
      class="xl:col-span-2 xl:row-span-1 order-5 xl:order-none h-full"
      :title="
        filters.selectedType === 'movie' ? $t('dateRange.title') : $t('dateRange.first_air_date')
      "
    />

    <HomeFilterCompany class="xl:col-span-2 xl:row-span-1 order-3 xl:order-none h-full" />

    <HomeFilterAge class="xl:col-span-2 xl:row-span-1 order-6 xl:order-none h-full" />

    <HomeFilterMark class="xl:col-span-2 xl:row-span-1 order-7 xl:order-none h-full" />

    <HomeFilterDuration class="xl:col-span-2 xl:row-span-1 order-8 xl:order-none h-full" />
  </div>
</template>

<script lang="ts" setup>
import type { CalendarDate } from '@internationalized/date'

const { filters, isMovieTypeActive, isTvTypeActive } = useFilters()

const moreFilters = defineModel<boolean>('moreFilters', {
  required: true,
  default: false
})
</script>
