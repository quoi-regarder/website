<template>
  <UContainer v-if="moreFilters" id="filters" class="grid grid-cols-1 gap-4 p-4">
    <!-- Main filters - Sort by -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <HomeFilterMonetization />
      <HomeFilterCompany />
    </div>

    <!-- Date and duration filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <HomeFilterBy />
      <HomeFilterDateRange
        v-model:to-date="(filters.toDate as CalendarDate)"
        v-model:from-date="(filters.fromDate as CalendarDate)"
        :title="
          filters.selectedType === 'movie'
            ? $t('dateRange.title')
            : $t('dateRange.first_air_date')
        "
      />
    </div>

    <!-- Secondary filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <HomeFilterVotes v-model="filters.selectedVotes" />
      <HomeFilterDuration />
    </div>

    <!-- Secondary filters - Age and air date -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  </UContainer>
</template>

<script lang="ts" setup>
import type { CalendarDate } from '@internationalized/date'

const { filters, isMovieTypeActive, isTvTypeActive } = useFilters()

const moreFilters = defineModel<boolean>('moreFilters', {
  required: true,
  default: false
})
</script>
