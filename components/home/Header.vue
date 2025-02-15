<template>
  <UContainer
    :class="{
      'lg:min-h-[35vh]': hasResults,
      'lg:min-h-[55vh]': !hasResults
    }"
    class="w-full flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-out relative py-12"
  >
    <h1 class="text-4xl text-[var(--ui-color-primary-400)] font-bold text-center mb-2">
      {{ $t('home.title') }}
    </h1>
    <h2 class="text-lg font-semibold text-center mb-8">{{ $t('home.subtitle') }}</h2>

    <div class="flex items-center justify-center gap-4">
      <UTooltip :text="$t('home.form.tooltip.reset')">
        <UButton
          icon="i-heroicons-arrow-path-rounded-square"
          size="xl"
          variant="outline"
          @click="resetSeachAndFilters"
        />
      </UTooltip>
      <UButton
        id="searchButton"
        :loading="isSearching"
        icon="i-heroicons-magnifying-glass"
        size="xl"
        @click="newSearch"
      >
        {{ $t('home.form.buttons.search') }}
      </UButton>
    </div>
    <div class="flex flex-col mt-4">
      <HomeFilterType v-model="filters.selectedType" />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const { search, isSearching, resetSearch, hasResults } = useSearch()
const { resetFilters, filters } = useFilters()

const resetSeachAndFilters = () => {
  resetSearch()
  resetFilters()
}

const newSearch = () => {
  resetSearch()
  search(true)
}
</script>
