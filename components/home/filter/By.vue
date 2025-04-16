<template>
  <NuxtLayout
    name="filter"
    :title="$t('by.title')"
    :description="$t('by.description')"
    :hint="$t('by.hint')"
    has-buttons
    show-tooltip
  >
    <template #buttons>
      <UButton :label="$t('by.buttons.reset')" variant="subtle" color="secondary" @click="reset" />
    </template>

    <template #content>
      <div class="flex w-full items-center gap-2">
        <FieldSingleSelect
          v-model="items"
          v-model:selected-model="filters.selectedFilterBy"
          name="by"
          class="w-full"
        />

        <UButton
          color="secondary"
          class="w-fit"
          @click="toggleDirection"
        >
          <UIcon
            :name="
              filters.selectedFilterByDirection === 'asc'
                ? 'i-lucide:chevron-up'
                : 'i-lucide:chevron-down'
            "
            class="size-5 sm:size-6"
          />
        </UButton>
      </div>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const { filters } = useFilters()

const movieItems = ref<Option[]>([
  { id: 'title', label: t('by.labels.title') },
  { id: 'original_title', label: t('by.labels.original_title') },
  { id: 'primary_release_date', label: t('by.labels.primary_release_date') },
  { id: 'revenue', label: t('by.labels.revenue') },
  { id: 'vote_average', label: t('by.labels.vote_average') },
  { id: 'vote_count', label: t('by.labels.vote_count') }
])

const tvItems = ref<Option[]>([
  { id: 'name', label: t('by.labels.name') },
  { id: 'original_name', label: t('by.labels.original_name') },
  { id: 'first_air_date', label: t('by.labels.first_air_date') },
  { id: 'vote_average', label: t('by.labels.vote_average') },
  { id: 'vote_count', label: t('by.labels.vote_count') }
])

const items = computed(() =>
  filters.value.selectedType === 'movie' ? movieItems.value : tvItems.value
)

const reset = () => {
  filters.value.selectedFilterBy = undefined
  filters.value.selectedFilterByDirection = null
}

const toggleDirection = () => {
  filters.value.selectedFilterByDirection =
    filters.value.selectedFilterByDirection === 'asc' ? 'desc' : 'asc'
}
</script>
