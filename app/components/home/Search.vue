<template>
  <div class="flex items-center justify-center gap-4 pt-8">
    <UButton
      icon="i-lucide:undo-2"
      color="secondary"
      size="xl"
      variant="subtle"
      :label="$t('home.form.buttons.reset')"
      @click="resetSeachAndFilters"
    />
    <ClientOnly>
      <UButton
        id="searchButton"
        :loading="isSearching"
        icon="i-lucide:search-check"
        size="xl"
        :label="
          selectedType === 'movie'
            ? $t('home.form.buttons.searchMovie')
            : $t('home.form.buttons.searchSeries')
        "
        @click="newSearch"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const { search, isSearching, resetSearch } = useSearch()
const { resetFilters, selectedType } = useFilters()

const resetSeachAndFilters = () => {
  resetSearch()
  resetFilters()
}

const newSearch = () => {
  resetSearch()
  search(true)
}
</script>
