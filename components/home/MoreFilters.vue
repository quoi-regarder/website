<template>
  <div v-if="moreFilters" id="filters" class="grid grid-cols-1 gap-3 p-2 md:p-4">
    <!-- Main filters - Sort by -->
    <div class="md:grid md:grid-cols-2 gap-3">
      <HomeFilterMonetization />

      <HomeFilterCompany class="mb-3 md:mb-0" />
    </div>

    <!-- Date and duration filters -->
    <div class="md:grid md:grid-cols-12 gap-3">
      <div class="md:col-span-12 lg:col-span-6 xl:col-span-7">
        <HomeFilterBy />
      </div>

      <div class="md:col-span-12 lg:col-span-6 xl:col-span-5">
        <HomeFilterDateRange
          v-model:to-date="filters.toDate as CalendarDate"
          v-model:from-date="filters.fromDate as CalendarDate"
          :title="
            filters.selectedType === 'movie'
              ? $t('dateRange.title')
              : $t('dateRange.first_air_date')
          "
        />
      </div>
    </div>

    <!-- Secondary filters -->
    <div class="md:grid md:grid-cols-2 gap-3">
      <HomeFilterVotes v-model="filters.selectedVotes" />

      <HomeFilterDuration />
    </div>

    <!-- Secondary filters - Age and air date -->
    <div class="md:grid md:grid-cols-2 gap-3">
      <HomeFilterAge />

      <div v-if="isTvTypeActive">
        <HomeFilterDateRange
          v-model:to-date="filters.airToDate as CalendarDate"
          v-model:from-date="filters.airFromDate as CalendarDate"
          :title="$t('dateRange.air_date')"
        />
      </div>

      <div v-if="isMovieTypeActive">
        <HomeFilterPerson />
      </div>
    </div>
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
